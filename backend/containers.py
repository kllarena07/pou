import os
import modal
from dotenv import load_dotenv
import subprocess

load_dotenv()

env_vars = {
    "GROQ_API_KEY": os.getenv("GROQ_API_KEY")
}

modalApp = modal.App("dependepou")

# Define the Docker image with necessary dependencies
test_image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install("git", "python3", "bash")
    .pip_install("python-dotenv", "groq")
)

@modalApp.function(secrets=[modal.Secret.from_name("dependepou")], image=test_image)
def run_script() -> str:
    """
    Clones the given repository, runs `init.sh`, and returns combined logs.
    """
    # Update environment variables
    os.environ.update(env_vars)

    outputs = []
    result = subprocess.run(
        ["git", "clone", "https://github.com/kllarena07/pou-test.git", "scripts"],
        check=True,
        capture_output=True,
        text=True
    )
    outputs.append(result.stdout)
    os.chdir("scripts")
    os.chmod("./init.sh", 0o755)
    result = subprocess.run(
        ["./init.sh"],
        check=True,
        capture_output=True,
        text=True
    )
    outputs.append(result.stdout)
    # Commands to execute
    commands = [
        "cd scripts",
        "ls",
        "chmod +x ./scripts/init.sh",
        "bash -c 'source ./scripts/init.sh'"
    ]

    return "\n".join(outputs)
