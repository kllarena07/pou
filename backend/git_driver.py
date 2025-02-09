from git import Repo
import uuid
import requests
from os import getenv
from dotenv import load_dotenv

load_dotenv()

def load_repository(repo_path="./staging"):
  repo = Repo(repo_path)
  origin = repo.remotes.origin
  # Modified $SELECTION_PLACEHOLDER$ code:
  origin_url = origin.url
  return repo, origin, origin_url


def create_and_push_branch(repo, origin, files_to_stage):
  new_branch_name = uuid.uuid4().hex
  new_branch = repo.create_head(new_branch_name)
  new_branch.checkout()

  print("Created and switched to branch:", new_branch_name)

  repo.index.add(files_to_stage)
  print("Staged files:", files_to_stage)

  repo.index.commit("Automated commit message.")

  origin.push(new_branch)
  print("Pushed branch to remote.")

  return new_branch_name


def create_pull_request(new_branch_name, repo_owner, repo_name, base_branch):
  GITHUB_TOKEN = getenv("GITHUB_TOKEN")
  if not GITHUB_TOKEN:
    raise Exception("GITHUB_TOKEN environment variable not set.")

  pr_title = f"Automated PR for branch {new_branch_name}"
  pr_body = "This pull request was automatically created."
  
  headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
  }
  data = {
    "title": pr_title,
    "head": new_branch_name,
    "base": base_branch,
    "body": pr_body
  }
  url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/pulls"
  response = requests.post(url, json=data, headers=headers)

  if response.status_code == 201:
    pr_url = response.json().get("html_url")
    print("Pull request created:", pr_url)
    return pr_url
  else:
    print("Failed to create pull request:", response.json())
    return None

# EXAMPLE
# def main():
#   # Load repository
#   repo, origin, origin_url = load_repository()
#   print("Repo origin URL:", origin_url)

#   # Set variables
#   files_to_stage = ["file1.txt", "file2.txt"]  # Replace with your list of files
#   commit_message = "Automated commit"

#   # Create branch and push changes
#   new_branch_name = create_and_push_branch(repo, origin, files_to_stage, commit_message)

#   # Create pull request via GitHub's API
#   repo_owner = "nebudev14"
#   repo_name = "outdated-website"
#   base_branch = "main"  # The branch you want to merge into
#   pr_body = "This pull request was automatically created."

#   create_pull_request(new_branch_name, repo_owner, repo_name, base_branch, pr_body)


# if __name__ == "__main__":
#   main()