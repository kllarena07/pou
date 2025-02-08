from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import docker
from docker.errors import DockerException, ContainerError

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
        client = docker.from_env()
        # Run all steps in a single container command:
        # 1. Install git.
        # 2. Clone the repository into "repo".
        # 3. Change directory into "repo".
        # 4. Make hello.sh executable and run it.
        container = client.containers.run(
            image="alpine:latest",
            # command=["/bin/sh", "-c", 
            #      f"apk add --no-cache git && git clone https://github.com/kllarena07/pou-test.git && git clone {request.repository} repo && cd repo && chmod +x hello.sh && ./hello.sh"],
            command=["/bin/sh", "-c", 
                 f"apk add --no-cache git && apk add --no-cache python3 && git clone https://github.com/kllarena07/pou-test.git scripts && cd scripts && chmod +x init.sh && source init.sh"],
            detach=True,
            stdout=True,
            stderr=True
        )
        container.wait()  # Wait for the container to finish executing.
        output = container.logs()  # Capture logs from the container.
        container.remove()  # Delete the container.
        # Decode output from bytes to string.
        output_str = output.decode("utf-8")
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
