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
def run_script(repo_url: str) -> str:
    """
    Clones the given repository, runs `init.sh`, and returns combined logs.
    """
    # Update environment variables
    os.environ.update(env_vars)

    outputs = []
    outputs.append(subprocess.run(
        ["git", "clone", "https://github.com/kllarena07/pou-test.git", "scripts"],
        check=True,
        capture_output=True,
        text=True
    ).stdout)


    result = os.chdir("scripts")
    outputs.append(subprocess.run(
        ["git", "clone", repo_url, "repository"],
        check=True,
        capture_output=True,
        text=True
    ).stdout)

    # outputs.append(os.getcwd())
    outputs.append(subprocess.run(
        ["ls", "repository"],
        check=True,
        capture_output=True,
        text=True
    ).stdout)

    os.chmod("./init.sh", 0o755)
    result = subprocess.run(
        ["./init.sh"],
        check=True,
        capture_output=True,
        text=True
    )
    outputs.append(result.stderr)
    outputs.append(result.stdout)


    # outputs.append(subprocess.run(
    #     ["ls"],
    #     check=True,
    #     capture_output=True,
    #     text=True
    # ).stdout)

    return "\n".join(outputs)
