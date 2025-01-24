import json
from datetime import datetime, date
import requests
from dotenv import load_dotenv
import os
import subprocess

load_dotenv()# Load environment variables
print("Running hit_standings.py ...")
#inputs for nba api below:
url = "https://api-nba-v1.p.rapidapi.com/standings"
querystring = {"league":"standard","season":"2024"}
headers = {
	"x-rapidapi-key": os.getenv('NBA_API_KEY'),
	"x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
}

#Functions used by main process
def git_push_changes():#git automated commands
    try:
        subprocess.run(["git", "add", "standings.json"], check=True)
        commit_message = f"Update NBA standings data {date.today()}"
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("Changes pushed to GitHub successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

def should_run():#check last_run to limit usage
    print("Checking if NBA API needs to be called...")
    try:
        with open('last_run.txt', 'r') as f:
            last_run = datetime.strptime(f.read().strip(), '%Y-%m-%d').date()
            return last_run < date.today()
    except FileNotFoundError:
        return True

def update_last_run():#updates last_run
    with open('last_run.txt', 'w') as f:
        f.write(date.today().strftime('%Y-%m-%d'))

#Main function
def fetch_and_save():#calls api to return json data and dumps it in standings.json
    if should_run():
        try:
            response = requests.get(url, headers=headers, params=querystring)
            data = response.json()
            with open('standings.json', 'w') as f:
                json.dump(data, f)
            update_last_run()
            print("API data updated successfully")
            git_push_changes()
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("Already ran today, skipping...")

fetch_and_save()#run the script