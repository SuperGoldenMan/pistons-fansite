import json
from datetime import datetime, date
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

url = "https://api-nba-v1.p.rapidapi.com/standings"
querystring = {"league":"standard","season":"2024"}

headers = {
    "x-rapidapi-key": os.getenv('NBA_API_KEY'),
    "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
}

def update_last_run():#updates last_run
    with open('last_run.txt', 'w') as f:
        f.write(date.today().strftime('%Y-%m-%d'))

def fetch_and_save():
    try:
        response = requests.get(url, headers=headers, params=querystring)
        response.raise_for_status()
        data = response.json()
        with open('standings.json', 'w') as f:
            json.dump(data, f, indent=4)
        update_last_run()
        print("NBA standings data saved successfully!")
    except requests.RequestException as e:
        print(f"API request failed: {e}")
    except json.JSONDecodeError as e:
        print(f"JSON parsing failed: {e}")

fetch_and_save()