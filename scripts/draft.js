async function setDraftPickPositions() {
    try {
      const response = await fetch('../data/standings.json');
      const data = await response.json();
  
      const teams = data.response;
  
      // Sort teams by win percentage ASCENDING
      const sortedTeams = [...teams].sort((a, b) => parseFloat(a.win.percentage) - parseFloat(b.win.percentage));
  
      // Find Detroit Pistons position
      const pistonsIndex = sortedTeams.findIndex(team => team.team.name === "Detroit Pistons");
      const pistonsPick = pistonsIndex + 1; // Because index is 0-based
  
      // Find Toronto Raptors position
      const raptorsIndex = sortedTeams.findIndex(team => team.team.name === "Toronto Raptors");
      const secondRoundPick = raptorsIndex + 31; // Add 30 (2nd round starts at pick 31)
  
      // Inject into HTML
      document.querySelector('#draft .first h2#draft-pick-1').innerText = `1st Pick: Currently #${pistonsPick}(owned by MIN)`;
      document.querySelector('#draft .second h2#draft-pick-2').innerText = `2nd Pick: Currently #${secondRoundPick}(via TOR)`;
  
    } catch (err) {
      console.error("Error loading or processing standings:", err);
    }
  }
  
  setDraftPickPositions();
  