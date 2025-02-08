from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import docker
from docker.errors import DockerException
from typing import Optional

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
        # Initialize Docker client
        client = docker.from_env()
        
        # Create and run container
        container = client.containers.run(
            'alpine:latest',
            [
                '/bin/sh', '-c',
                f'''
                apk add --no-cache git && \
                git clone {request.repository} /repo && \
                cd /repo && \
                chmod +x hello.sh && \
                ./hello.sh
                '''
            ],
            volumes={'/tmp/repos': {'bind': '/repo', 'mode': 'rw'}},
            detach=True
        )
        
        # Wait for container to finish and get logs
        container.wait()
        logs = container.logs().decode('utf-8')
        container.remove()
        
        return {
            'status': 'success',
            'message': "Repository cloned and script executed successfully",
            'repository': request.repository,
            'output': logs
        }

    except DockerException as e:
        raise HTTPException(status_code=500, detail=f"Docker error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=5000)
