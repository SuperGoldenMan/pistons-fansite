import json
from datetime import datetime, date
import requests
from dotenv import load_dotenv
import os
import subprocess
import time
load_dotenv()# Load environment variables
print("Running hit_api.py ...")


#inputs for nba api below:
url = "https://api-nba-v1.p.rapidapi.com/standings"
url_fixtures = "https://api-nba-v1.p.rapidapi.com/games"
querystring = {"league":"standard","season":"2024"}
querystring_fixtures = {"season":"2024","team":"10"}
url_stats = "https://api-nba-v1.p.rapidapi.com/players/statistics"
querystring_stats = {"team":"10","season":"2024"}
headers = {
	"x-rapidapi-key": os.getenv('NBA_API_KEY'),
	"x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
}

def log_error(message):
    with open("error_log.txt", "a") as log:
        log.write(f"{datetime.now().isoformat()} - {message}\n")


def fetch_with_retry(url, querystring, file_name, description):
    retries = 3
    delay = 5
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, params=querystring)
            response.raise_for_status()
            data = response.json()
            with open(file_name, 'w') as f:
                json.dump(data, f, indent=4)
            print(f"{description} data saved successfully!")
            return
        except requests.HTTPError as e:
            if response.status_code == 429 and attempt < retries - 1:
                print(f"429 Too Many Requests. Retrying in {delay} seconds...")
                time.sleep(delay)
                delay *= 2  # exponential backoff
            else:
                print(f"{description} API request failed: {e}")
                return
        except json.JSONDecodeError as e:
            print(f"{description} JSON parsing failed: {e}")
            return
        except Exception as e:
            print(f"Unexpected error while fetching {description}: {e}")
            return

def fetch_stats():
    fetch_with_retry(url_stats, querystring_stats, "../data/playerstats.json", "Player stats")
    time.sleep(3)

def fetch_standings():
    fetch_with_retry(url, querystring, "../data/standings.json", "NBA standings")
    time.sleep(3)

def fetch_fixtures():
    fetch_with_retry(url_fixtures, querystring_fixtures, "../data/pistonsgames.json", "Pistons fixtures")
    time.sleep(3)

def git_push_changes():#push to origin main
    try:
        subprocess.run(["git", "add", "../data/standings.json", "../data/pistonsgames.json", "../data/playerstats.json"], check=True)
        result = subprocess.run(["git", "diff", "--cached", "--quiet"])
        if result.returncode == 0:
            print("No changes to commit.")
            return
        commit_message = f"Update NBA data {date.today()}"
        subprocess.run(["git", "config", "--local", "user.email", "action@github.com"], check=True)
        subprocess.run(["git", "config", "--local", "user.name", "GitHub Action"], check=True)
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("Changes pushed to GitHub successfully!")
    except subprocess.CalledProcessError as e:
        error_msg = f"Git operation failed: {e}"
        print(error_msg)
        log_error(error_msg)



#Main function
def fetch_and_save():#calls api to return json data and dumps it in standings.json
    try:
        fetch_stats()
        fetch_standings()
        fetch_fixtures()
        print("NBA API hit successfully!...")
        git_push_changes()
    except Exception as e:
        print(f"Error: {e}")


#run the script
fetch_and_save()
