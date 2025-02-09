import os
import modal
from dotenv import load_dotenv
import subprocess
from checker import fetch_updates
from checker import CodeChange

load_dotenv()

env_vars = {
    "GROQ_API_KEY": os.getenv("GROQ_API_KEY")
}

modalApp = modal.App("dependepou")

# Define the Docker image with necessary dependencies
test_image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "python3", "bash")
    .pip_install("python-dotenv", "groq", "fastapi", "uvicorn", "modal", "instructor", "pydantic")
    .add_local_python_source("checker")
)

@modalApp.function(secrets=[modal.Secret.from_name("dependepou")], image=test_image)
def run_script(repo_url: str) -> list[CodeChange]:
    """
    Clones the given repository, runs `init.sh`, and returns combined logs.
    """
    # Update environment variables
    os.environ.update(env_vars)

    subprocess.run(
        ["git", "clone", "https://github.com/kllarena07/pou-test.git", "scripts"],
        check=True,
        capture_output=True,
        text=True
    ).stdout



    os.chdir("scripts")
    subprocess.run(
        ["git", "clone", repo_url, "repository"],
        check=True,
        capture_output=True,
        text=True
    ).stdout

    subprocess.run(
        ["ls", "repository"],
        check=True,
        capture_output=True,
        text=True
    ).stdout

    data = fetch_updates(os.getcwd() + "/repository")


    return [change.model_dump(mode="json") for change in data]  # Ensure CodeChange is serializable
