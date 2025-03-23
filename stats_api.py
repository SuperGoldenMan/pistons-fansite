import json
from datetime import datetime, date
import requests
from dotenv import load_dotenv
import os
import subprocess
load_dotenv()# Load environment variables
print("Running stats_api.py ...")

url = "https://api-nba-v1.p.rapidapi.com/players/statistics"
querystring = {"team":"10","season":"2024"}
headers = {
	"x-rapidapi-key": os.getenv('NBA_API_KEY'),
	"x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
}

def fetch_stats():#api call for playerstats
    try:
        response = requests.get(url, headers=headers, params=querystring)
        data = response.json()
        with open('playerstats.json', 'w') as f:
            json.dump(data, f)
            print("Player stats data saved successfully!")
    except requests.RequestException as e:
        print(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")


def git_add_changes():#add changes
    try:
        subprocess.run(["git", "add", "playerstats.json"], check=True)
        print("Changes staged successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Git operation failed: {e}")

def should_run():#check last_run to limit usage
    try:
        with open('last_run.txt', 'r') as f:
            last_run = datetime.strptime(f.read().strip(), '%Y-%m-%d').date()
            return last_run < date.today()
    except FileNotFoundError:
        return True

#Main function
def fetch_and_save():#calls api to return json data and dumps it in playerstats.json
    if should_run():
        try:
            fetch_stats()
            git_add_changes()
            print("stats_api run was successfull!")
        except Exception as e:
            print(f"Error: {e}")
    else:
        print("API already hit today!")


#run the script
fetch_and_save()
