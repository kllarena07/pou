import modal
import checker
import containers

image = modal.Image.debian_slim(python_version="3.10").apt_install("git", "python3", "bash").pip_install("python-dotenv", "groq", "fastapi", "uvicorn", "modal", "instructor", "pydantic").add_local_python_source("checker").add_local_python_source("containers")
writeApp = modal.App(name="groq-write", image=image)

@writeApp.function(secrets=[modal.Secret.from_name("GROQ_API_KEY")])
def process_file(job):
  from groq import Groq
  from pydantic import BaseModel, ValidationError
  from os import getenv
  import instructor
  import json

  GROQ_API_KEY = getenv("GROQ_API_KEY")

  class JobReport(BaseModel):
    refactored_code: str
    refactored_code_comments: str

  client = Groq(api_key=GROQ_API_KEY)
  client = instructor.from_groq(client, mode=instructor.Mode.TOOLS)

  file_path = job["path"]
  code_content = job["code_content"]

  user_prompt = (
      "Analyze the following code and determine if the syntax is out of date. "
      "If it is out of date, specify what changes need to be made in the following JSON format:\n\n"
      "{\n"
      '  "refactored_code": "A rewrite of the file that is more up to date, using the native language (i.e. if the file is a NextJS file, rewrite the NextJS file using Javascript/Typescript with the updated API changes)". The file should be a complete file, not just a partial updated code segment,\n'
      '  "refactored_code_comments": "Comments and explanations for your code changes. Be as descriptive, informative, technical as possible."\n'
      "}\n\n"
      f"{code_content}"
  )

  try:
      job_report = client.chat.completions.create(
          model="llama3-8b-8192",
          messages=[{"role": "system", "content": "You are a helpful assistant that analyzes code and returns a JSON object with the refactored code and the comments that come with it. Your goal is to identify outdated syntax in code and suggest changes to update it to the latest syntax."}, {"role": "user", "content": user_prompt}],
          response_model=JobReport,
      )

      return {
          "file_path": file_path,
          **job_report.model_dump()
      }
  except (ValidationError, json.JSONDecodeError) as parse_error:
      print(f"Error parsing LLM response for {file_path}: {parse_error}")
      return None
  except Exception as e:
      # Handle any other exceptions, e.g. network errors, model issues, etc.
      print(f"Error analyzing {file_path}: {e}")
      return None

# @app.local_entrypoint()
# def main():
#   import json
#   job_list = []

#   file_path = "./test.jsx"

#   with open(file_path, "r") as file_obj:
#     job_list.append({
#       "file_path": file_path,
#       "file_content": file_obj.read()
#     })

#   refactored_jobs = []

#   for job in job_list:
#     output = process_file.remote(job)  # spin up a container for every file
#     refactored_jobs.append({
#       "path": output["file_path"],
#       "new_content": output["refactored_code"],
#       "comments": output["refactored_code_comments"]
#     })
  
#   return refactored_jobs

# change_log has the shape
# [
#   {
#     "path": "your/mom/index.tsx"
#     "content" "(lots of js code)"
#   },
#   ...
# ]

# change_log has the shape
# [
#   {
#     "path": "your/mom/index.tsx"
#     "new_content" "(lots of js code)"
#   },
#   ...
# ]