export function getBaseAssetPath() {
    const isGitHubPages = window.location.hostname.includes('github.io');
    return isGitHubPages
      ? '/pistons-fansite/assets/team-logos/'
      : 'assets/team-logos/';
  }
  
  export function getBaseDataPath() {
    return window.location.hostname.includes('github.io')
      ? '/pistons-fansite/data/'
      : 'data/';
  }
  
  export function getTeamLogoPath(teamId) {
    const isGitHubPages = window.location.hostname.includes('github.io');
    const baseAssetPath = isGitHubPages ? '/pistons-fansite/assets/team-logos/' : '../assets/team-logos/';
    return `${baseAssetPath}${teamId}.png`;
  }
  