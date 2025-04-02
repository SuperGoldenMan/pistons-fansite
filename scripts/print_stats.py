import json
from collections import defaultdict

# Load saved stats
with open('playerstats.json') as f:
    data = json.load(f)

# Group stats per player
players = defaultdict(lambda: {
    "games": 0,
    "points": 0,
    "rebounds": 0,
    "assists": 0,
    "steals": 0,
    "blocks": 0,
    "fgm": 0,
    "fga": 0,
    "tpm": 0,
    "tpa": 0,
    "ftm": 0,
    "fta": 0,
    "firstname": "",
    "lastname": ""
})

# Parse each stat line with game ID filter
for entry in data["response"]:
    game_id = entry.get("game", {}).get("id", 0)
    if game_id < 14051:
        continue

    player_id = entry["player"]["id"]
    players[player_id]["games"] += 1
    players[player_id]["points"] += entry["points"]
    players[player_id]["rebounds"] += entry["totReb"]
    players[player_id]["assists"] += entry["assists"]
    players[player_id]["steals"] += entry["steals"]
    players[player_id]["blocks"] += entry["blocks"]
    players[player_id]["fgm"] += entry["fgm"]
    players[player_id]["fga"] += entry["fga"]
    players[player_id]["tpm"] += entry["tpm"]
    players[player_id]["tpa"] += entry["tpa"]
    players[player_id]["ftm"] += entry["ftm"]
    players[player_id]["fta"] += entry["fta"]
    players[player_id]["firstname"] = entry["player"]["firstname"]
    players[player_id]["lastname"] = entry["player"]["lastname"]

# Print per-player averages
for pid, stats in players.items():
    g = stats["games"]
    if g == 0:
        continue
    fg_pct = stats["fgm"] / stats["fga"] * 100 if stats["fga"] > 0 else 0
    tp_pct = stats["tpm"] / stats["tpa"] * 100 if stats["tpa"] > 0 else 0
    ft_pct = stats["ftm"] / stats["fta"] * 100 if stats["fta"] > 0 else 0
    print(f"\nPlayer: {stats['firstname']} {stats['lastname']}")
    print(f"PPG: {stats['points'] / g:.1f} | RPG: {stats['rebounds'] / g:.1f} | APG: {stats['assists'] / g:.1f}")
    print(f"SPG: {stats['steals'] / g:.1f} | BPG: {stats['blocks'] / g:.1f}")
    print(f"FG%: {fg_pct:.1f}% | 3P%: {tp_pct:.1f}% | FT%: {ft_pct:.1f}%")
