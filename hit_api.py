import json
from datetime import datetime, date
import requests
from dotenv import load_dotenv
import os
import subprocess
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


#Functions used by main process
def fetch_stats():#api call for playerstats
    try:
        response = requests.get(url_stats, headers=headers, params=querystring_stats)
        data = response.json()
        with open('playerstats.json', 'w') as f:
            json.dump(data, f)
            print("Player stats data saved successfully!")
    except requests.RequestException as e:
        print(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")


def fetch_fixtures():#api call for fixtures list
    try: 
        response = requests.get(url_fixtures, headers=headers, params=querystring_fixtures)
        response.raise_for_status()
        data = response.json()
        with open('pistonsgames.json', 'w') as f:
            json.dump(data, f, indent=4)
        print("Pistons fixtures data saved successfully!")
    except requests.RequestException as e:
        print(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")

def fetch_standings():#api call for standings
    try:
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()
        with open('standings.json', 'w') as f:
            json.dump(data, f)
            print("NBA standings data saved successfully!")
    except requests.RequestException as e:
        print(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")

def git_push_changes():#push to origin main
    try:
        subprocess.run(["git", "add", "standings.json", "pistonsgames.json", "playerstats.json"], check=True)
        commit_message = f"Update NBA data {date.today()}"
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
            fetch_stats()
            fetch_standings()
            fetch_fixtures()
            update_last_run()
            print("NBA API hit successfully!...")
            git_push_changes()
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("API already hit today!")


#run the script
fetch_and_save()
