from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import docker
from docker.errors import DockerException, ContainerError
import os
from dotenv import load_dotenv
import subprocess
import modal
from containers import modalApp, run_script

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
            output_str = run_script.remote()
        return {
            "status": "success",
            "message": "Repository updated and script executed successfully",
            "repository": request.repository,
            "output": output_str,
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
