from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import docker
from docker.errors import DockerException, ContainerError
import os
from dotenv import load_dotenv
import subprocess
from containers import modalApp, run_script
from modal_write import writeApp, process_file
from git_driver import load_repository, create_and_push_branch, create_pull_request

load_dotenv()

app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define request model
class UpdateRequest(BaseModel):
    repository: str

@app.post('/update')
async def update(request: UpdateRequest):
    try:
        with modalApp.run():
            job_list = run_script.remote(request.repository)

        with writeApp.run():
            refactored_jobs = []
            for job in job_list:
                output = process_file.remote(job)  # spin up a container for every file and wait for result
                refactored_jobs.append({
                    "path": f"{os.getcwd()}/staging{output["file_path"][24:]}",
                    "new_content": output["refactored_code"],
                    "comments": output["refactored_code_comments"]
                })
      
        # create staging area
        staging_dir = os.path.join(os.getcwd(), "staging")
        if not os.path.exists(staging_dir):
            os.makedirs(staging_dir)

        # Clone repository and wait for completion
        clone_cmd = ["git", "clone", request.repository, staging_dir]
        result = subprocess.call(clone_cmd)

        # Load repository info once clone is complete
        repo, origin, origin_url = load_repository(staging_dir)

        files_changed = []

        for job in refactored_jobs:
            file_path = job.get("path")
            print("filepath:", file_path)
            files_changed.append(file_path)
            if os.path.exists(file_path):
                with open(file_path, "w") as f:
                    f.write(job.get("new_content"))
            else:
                print(f"File {file_path} does not exist")

        new_branch_name = create_and_push_branch(repo, origin, files_changed)
        
        create_pull_request(new_branch_name, request.repository_owner, request.repository_name, "main")

        return {
            "status": "success",
            "message": "Repository updated and script executed successfully",
            "repository": request.repository,
            "output": refactored_jobs,
        }
    except ContainerError as ce:
        # ContainerError contains stderr output which we decode.
        err_output = ce.stderr.decode("utf-8") if ce.stderr else str(ce)
        raise HTTPException(status_code=500, detail=f"Container error: {err_output}")
    except DockerException as de:
        raise HTTPException(status_code=500, detail=f"Docker error: {str(de)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("server:app", host="127.0.0.1", port=5000, reload=True)
