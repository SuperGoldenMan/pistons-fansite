// Listener for player image click
document.querySelectorAll('.player-item').forEach(item => {
    item.addEventListener('click', () => {
      const playerId = item.dataset.playerId;
      console.log("Clicked:", playerId);
      showPlayerOverlay(playerId);
    });
  });

// function to get player stats from json file and calculate averages on regular season games
function getPlayerAverages(data, firstName, lastName, minGameId = 14051) {
    const filteredGames = data.response.filter(g => g.game.id >= minGameId);
    const playerGames = filteredGames.filter(g =>
      g.player.firstname === firstName && g.player.lastname === lastName
    );
  
    const gamesPlayed = playerGames.length;
    if (gamesPlayed === 0) return null;
  
    const sum = (key) => playerGames.reduce((acc, g) => acc + (g[key] || 0), 0);
  
    const totalPoints = sum('points');
    const totalRebounds = sum('totReb');
    const totalAssists = sum('assists');
    const totalSteals = sum('steals');
    const totalBlocks = sum('blocks');
  
    const fgMade = sum('fgm');
    const fgAtt = sum('fga');
    const fgPercent = fgAtt ? ((fgMade / fgAtt) * 100).toFixed(1) : '0.0';
  
    const tpMade = sum('tpm');
    const tpAtt = sum('tpa');
    const tpPercent = tpAtt ? ((tpMade / tpAtt) * 100).toFixed(1) : '0.0';
  
    const ftMade = sum('ftm');
    const ftAtt = sum('fta');
    const ftPercent = ftAtt ? ((ftMade / ftAtt) * 100).toFixed(1) : '0.0';
  
    return {
      ppg: (totalPoints / gamesPlayed).toFixed(1),
      rpg: (totalRebounds / gamesPlayed).toFixed(1),
      apg: (totalAssists / gamesPlayed).toFixed(1),
      spg: (totalSteals / gamesPlayed).toFixed(1),
      bpg: (totalBlocks / gamesPlayed).toFixed(1),
      fgPercent,
      tpPercent,
      ftPercent,
      gamesPlayed
    };
  }

// players
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

// call json, map stats from calculated averages
fetch('playerstats.json')
  .then(res => res.json())
  .then(data => {
    window.fullStatsData = data;
  });


// show player overlay and close functions below
function showPlayerOverlay(playerId) {
    const player = players.find(p => p.id === playerId);
    if (!player || !window.fullStatsData) return;
  
    const stats = getPlayerAverages(window.fullStatsData, player.first, player.last);
    if (!stats) return;

    const imagePath = `assets/player-court/${player.id}.png`;
    const imageEl = document.getElementById('overlay-player-image');
    imageEl.src = imagePath;
    imageEl.alt = `${player.first} ${player.last}`;
    imageEl.onerror = () => {
    imageEl.src = 'assets/phone-background.jpg'; // optional fallback
};

    document.getElementById('overlay-player-name').innerText = `${player.first} ${player.last}`;
    document.getElementById('overlay-ppg').innerText = stats.ppg;
    document.getElementById('overlay-rpg').innerText = stats.rpg;
    document.getElementById('overlay-apg').innerText = stats.apg;
    document.getElementById('overlay-spg').innerText = stats.spg;
    document.getElementById('overlay-bpg').innerText = stats.bpg;
    document.getElementById('overlay-fgp').innerText = stats.fgPercent;
    document.getElementById('overlay-3ptp').innerText = stats.tpPercent;
    document.getElementById('overlay-ftp').innerText = stats.ftPercent;
  
    document.getElementById('player-overlay').classList.add('active');
  }

function closeOverlay() {
    document.getElementById('player-overlay').classList.remove('active');
  }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOverlay();
  });