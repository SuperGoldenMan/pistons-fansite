export function getBaseAssetPath() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    return isGitHubPages
      ? '/pistons-fansite/assets/team-logos/'
      : 'assets/team-logos/';
  }
  
  export function getTeamLogoPath(teamId) {
    return `${getBaseAssetPath()}${teamId}.png`;
  }
  
  export function getBaseDataPath() {
    return window.location.hostname.includes('github.io')
      ? '/pistons-fansite/data/'
      : 'data/';
  }
