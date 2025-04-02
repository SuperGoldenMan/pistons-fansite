// Constants
const REGULAR_SEASON_START = new Date('2024-10-07');

// Overlay click handling
document.querySelectorAll('.player-item').forEach(item => {
  item.addEventListener('click', () => {
    const playerId = item.dataset.playerId;
    console.log("Clicked:", playerId);
    showPlayerOverlay(playerId);
  });
});

function closeOverlay() {
  document.getElementById('player-overlay').classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
});

document.getElementById('player-overlay').addEventListener('click', (e) => {
  const content = document.querySelector('.overlay-content');
  if (!content.contains(e.target)) {
    closeOverlay();
  }
});

// Players
const players = [
  { id: 'cunnica01', first: 'Cade', last: 'Cunningham' },
  { id: 'iveyja01', first: 'Jaden', last: 'Ivey' },
  { id: 'beaslma01', first: 'Malik', last: 'Beasley' },
  { id: 'harrito02', first: 'Tobias', last: 'Harris'},
  { id: 'durenja01', first: 'Jalen', last: 'Duren' },
  { id: 'sassema01', first: 'Marcus', last: 'Sasser' },
  { id: 'hardati02', first: 'Tim', last: 'Hardaway Jr.' },
  { id: 'thompau01', first: 'Ausar', last: 'Thompson' },
  { id: 'fontesi01', first: 'Simone', last: 'Fontecchio' },
  { id: 'stewais01', first: 'Isaiah', last: 'Stewart' },
];

// Load JSON data
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/pistons-fansite/data/' : '../data/';

Promise.all([
  fetch(`${basePath}playerstats.json`).then(res => res.json()),
  fetch(`${basePath}pistonsgames.json`).then(res => res.json())
])
.then(([playerData, gameData]) => {
  window.fullStatsData = playerData;
  window.pistonsGameData = gameData.response;
});


// Helper to get game date
function getGameDate(gameId) {
  const game = window.pistonsGameData.find(g => g.id === gameId);
  return game && game.date?.start ? new Date(game.date.start) : null;
}

// Only include regular season games
function isRegularSeason(gameId) {
  const date = getGameDate(gameId);
  return date && date >= REGULAR_SEASON_START;
}

// Averages for season
function getPlayerAverages(data, firstName, lastName) {
  const playerGames = data.response.filter(g =>
    g.player.firstname === firstName &&
    g.player.lastname === lastName &&
    isRegularSeason(g.game.id)
  );

  const gamesPlayed = playerGames.length;
  if (gamesPlayed === 0) return null;

  const sum = (key) => playerGames.reduce((acc, g) => acc + (g[key] || 0), 0);

  const fgMade = sum('fgm'), fgAtt = sum('fga');
  const tpMade = sum('tpm'), tpAtt = sum('tpa');
  const ftMade = sum('ftm'), ftAtt = sum('fta');

  return {
    ppg: (sum('points') / gamesPlayed).toFixed(1),
    rpg: (sum('totReb') / gamesPlayed).toFixed(1),
    apg: (sum('assists') / gamesPlayed).toFixed(1),
    spg: (sum('steals') / gamesPlayed).toFixed(1),
    bpg: (sum('blocks') / gamesPlayed).toFixed(1),
    fgPercent: fgAtt ? ((fgMade / fgAtt) * 100).toFixed(1) : '0.0',
    tpPercent: tpAtt ? ((tpMade / tpAtt) * 100).toFixed(1) : '0.0',
    ftPercent: ftAtt ? ((ftMade / ftAtt) * 100).toFixed(1) : '0.0',
    gamesPlayed
  };
}

// Last game stats
function getLastGameStats(data, gameMeta, firstName, lastName) {
  const playerGames = data.response.filter(g =>
    g.player.firstname === firstName &&
    g.player.lastname === lastName &&
    isRegularSeason(g.game.id)
  );

  if (playerGames.length === 0) return null;

  const lastGame = playerGames.reduce((latest, current) =>
    getGameDate(current.game.id) > getGameDate(latest.game.id) ? current : latest
  );

  const gameDetails = gameMeta.find(g => g.id === lastGame.game.id);
  const gameDate = gameDetails?.date?.start
    ? new Date(gameDetails.date.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown';

  const isHome = lastGame.team.id === gameDetails?.teams?.home?.id;
  const opponent = isHome ? gameDetails.teams.visitors.name : gameDetails.teams.home.name;
  const location = isHome ? 'vs.' : '@';

  return {
    date: gameDate,
    points: lastGame.points,
    rebounds: lastGame.totReb,
    assists: lastGame.assists,
    steals: lastGame.steals,
    blocks: lastGame.blocks,
    fg: `${lastGame.fgm}/${lastGame.fga}`,
    tp: `${lastGame.tpm}/${lastGame.tpa}`,
    ft: `${lastGame.ftm}/${lastGame.fta}`,
    opponent,
    location
  };
}

function getPerformanceClass(current, average) {
  const numericCurrent = parseFloat(current);
  const numericAvg = parseFloat(average);

  if (isNaN(numericCurrent) || isNaN(numericAvg)) return "stat-neutral";

  const diff = numericCurrent - numericAvg;

  if (diff > 0.5) return "stat-better";
  if (Math.abs(diff) <= 0.5) return "stat-neutral";
  return "stat-worse";
}


// Overlay population
function showPlayerOverlay(playerId) {
  const player = players.find(p => p.id === playerId);
  if (!player || !window.fullStatsData || !window.pistonsGameData) return;

  document.getElementById('overlay-player-name').innerText = `${player.first} ${player.last}`;

  const stats = getPlayerAverages(window.fullStatsData, player.first, player.last);
  if (!stats) return;

  const lastGame = getLastGameStats(window.fullStatsData, window.pistonsGameData, player.first, player.last);

document.getElementById('overlay-ppg').innerHTML = `<span data-stat-type="ppg">${stats.ppg}</span>`;
document.getElementById('overlay-rpg').innerHTML = `<span data-stat-type="rpg">${stats.rpg}</span>`;
document.getElementById('overlay-apg').innerHTML = `<span data-stat-type="apg">${stats.apg}</span>`;
document.getElementById('overlay-spg').innerHTML = `<span data-stat-type="spg">${stats.spg}</span>`;
document.getElementById('overlay-bpg').innerHTML = `<span data-stat-type="bpg">${stats.bpg}</span>`;
document.getElementById('overlay-fgp').innerHTML = `<span data-stat-type="fgPercent">${stats.fgPercent}</span>`;
document.getElementById('overlay-3ptp').innerHTML = `<span data-stat-type="tpPercent">${stats.tpPercent}</span>`;
document.getElementById('overlay-ftp').innerHTML = `<span data-stat-type="ftPercent">${stats.ftPercent}</span>`;


  const imagePath = `assets/player-court/${player.id}.png`;
  const imageEl = document.getElementById('overlay-player-image');
  imageEl.src = imagePath;
  imageEl.alt = `${player.first} ${player.last}`;
  imageEl.onerror = () => {
    imageEl.src = 'assets/phone-background.jpg';
  };

  // Convert shooting splits to % for accurate performance check
  const [fgm, fga] = lastGame.fg.split('/').map(Number);
  const [tpm, tpa] = lastGame.tp.split('/').map(Number);
  const [ftm, fta] = lastGame.ft.split('/').map(Number);

  const fgPct = fga ? (fgm / fga) * 100 : 0;
  const tpPct = tpa ? (tpm / tpa) * 100 : 0;
  const ftPct = fta ? (ftm / fta) * 100 : 0;

  const statBoxes = `
    <div class="stat-box ${getPerformanceClass(lastGame.points, stats.ppg)}"><span>PTS</span><strong>${lastGame.points}</strong></div>
    <div class="stat-box ${getPerformanceClass(lastGame.rebounds, stats.rpg)}"><span>REB</span><strong>${lastGame.rebounds}</strong></div>
    <div class="stat-box ${getPerformanceClass(lastGame.assists, stats.apg)}"><span>AST</span><strong>${lastGame.assists}</strong></div>
    <div class="stat-box ${getPerformanceClass(lastGame.steals, stats.spg)}"><span>STL</span><strong>${lastGame.steals}</strong></div>
    <div class="stat-box ${getPerformanceClass(lastGame.blocks, stats.bpg)}"><span>BLK</span><strong>${lastGame.blocks}</strong></div>
    <div class="stat-box ${getPerformanceClass(fgPct, stats.fgPercent)}"><span>FG</span><strong>${lastGame.fg}</strong></div>
    <div class="stat-box ${getPerformanceClass(tpPct, stats.tpPercent)}"><span>3P</span><strong>${lastGame.tp}</strong></div>
    <div class="stat-box ${getPerformanceClass(ftPct, stats.ftPercent)}"><span>FT</span><strong>${lastGame.ft}</strong></div>
  `;

  if (lastGame) {
    document.getElementById('overlay-last-game').innerHTML = `
      <h1><span id="previously">Last Time Out</span> ${lastGame.location} <span id="opponent">${lastGame.opponent}</span> — </h1>
      <h2>${lastGame.date}</h2>
      <div class="last-game-stats">${statBoxes}</div>
    `;
  }

  document.getElementById('player-overlay').classList.add('active');

  // Add hover behavior to stat boxes
  document.querySelectorAll('.stat-box').forEach(box => {
    const label = box.querySelector('span').innerText; // e.g., "PTS", "FG"
    const valueRaw = box.querySelector('strong').innerText;
    const statTypeMap = {
      "PTS": "ppg",
      "REB": "rpg",
      "AST": "apg",
      "STL": "spg",
      "BLK": "bpg",
      "FG": "fgPercent",
      "3P": "tpPercent",
      "FT": "ftPercent"
    };
  
    const type = statTypeMap[label];
  
    // Calculate correct value for comparison
    let displayValue;
    if (["fgPercent", "tpPercent", "ftPercent"].includes(type)) {
      const [made, attempted] = valueRaw.split('/').map(Number);
      displayValue = attempted ? (made / attempted) * 100 : 0;
    } else {
      displayValue = parseFloat(valueRaw);
    }
  
    const performanceClass = getPerformanceClass(displayValue, stats[type]);
  
    box.addEventListener('mouseenter', () => {
      const statSpan = document.querySelector(`[data-stat-type="${type}"]`);
      if (statSpan) statSpan.classList.add(performanceClass);
    });
  
    box.addEventListener('mouseleave', () => {
      const statSpan = document.querySelector(`[data-stat-type="${type}"]`);
      if (statSpan) {
        statSpan.classList.remove('stat-better', 'stat-neutral', 'stat-worse');
      }
    });
  });
  
}