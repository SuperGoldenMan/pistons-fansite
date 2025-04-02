async function loadMobileGameData() {
    try {
        const response = await fetch('../data/pistonsgames.json');
        const data = await response.json();
        displayMobileFixtures(data);
    } catch (error) {
        console.error("Error loading mobile game data:", error);
    }
}

function getTeamLogoPath(teamId) {
    return `../assets/team-logos/${teamId}.png`;
}

function displayMobileFixtures(data) {
    const lastResultsContainer = document.getElementById("mobile-last-results");
    const upcomingGamesContainer = document.getElementById("mobile-upcoming-games");

    // Define the date threshold as October 20, 2024
    const dateThreshold = new Date("2024-10-20T00:00:00.000Z");

    // Filter and sort data
    const completedGames = data.response
        .filter(game => {
            const gameDate = new Date(game.date.start);
            return game.status.short === 3 && gameDate > dateThreshold;
        })
        .sort((a, b) => new Date(a.date.start) - new Date(b.date.start));

    const upcomingGames = data.response
        .filter(game => game.status.short === 1)  // Scheduled games
        .sort((a, b) => new Date(a.date.start) - new Date(b.date.start));

    // Display completed games in the first section
    lastResultsContainer.innerHTML = '';
    completedGames.forEach(game => {
        const homeTeam = game.teams.home;
        const visitorTeam = game.teams.visitors;
        const homeScore = game.scores.home.points;
        const visitorScore = game.scores.visitors.points;

        const homeLogoPath = getTeamLogoPath(homeTeam.id);
        const visitorLogoPath = getTeamLogoPath(visitorTeam.id);

        const fixtureBox = document.createElement("div");
        fixtureBox.classList.add("fixture-box");
        fixtureBox.innerHTML = `
            <div class="fixture-team">
                <img src="${homeLogoPath}" alt="${homeTeam.nickname} logo">
                <span>${homeTeam.nickname}</span>
            </div>
            <div class="fixture-score">
                <span>${homeScore}</span>
                <span> - </span>
                <span>${visitorScore}</span>
                <div class="fixture-status">FINAL</div>
            </div>
            <div class="fixture-team">
                <img src="${visitorLogoPath}" alt="${visitorTeam.nickname} logo">
                <span>${visitorTeam.nickname}</span>
            </div>
        `;
        lastResultsContainer.appendChild(fixtureBox);
    });

    // Display upcoming games in the second section
    upcomingGamesContainer.innerHTML = '';
    upcomingGames.forEach(game => {
        const homeTeam = game.teams.home;
        const visitorTeam = game.teams.visitors;
        const gameDate = new Date(game.date.start).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        const homeLogoPath = getTeamLogoPath(homeTeam.id);
        const visitorLogoPath = getTeamLogoPath(visitorTeam.id);

        const fixtureBox = document.createElement("div");
        fixtureBox.classList.add("fixture-box");
        fixtureBox.innerHTML = `
            <div class="fixture-team">
                <img src="${homeLogoPath}" alt="${homeTeam.nickname} logo">
                <span>${homeTeam.nickname}</span>
            </div>
            <div class="fixture-score">
                <span>${gameDate}</span>
                <div class="fixture-status">UPCOMING</div>
            </div>
            <div class="fixture-team">
                <img src="${visitorLogoPath}" alt="${visitorTeam.nickname} logo">
                <span>${visitorTeam.nickname}</span>
            </div>
        `;
        upcomingGamesContainer.appendChild(fixtureBox);
    });

    // Auto-scroll to the latest game on page load
    setTimeout(() => {
        lastResultsContainer.scrollLeft = lastResultsContainer.scrollWidth;
        upcomingGamesContainer.scrollLeft = 0; // Start at first upcoming game
    }, 500);
}

document.addEventListener("DOMContentLoaded", loadMobileGameData);
