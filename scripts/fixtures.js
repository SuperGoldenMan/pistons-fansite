window.addEventListener('load', () => {
  const lastResultsContainer = document.getElementById('last-results');
  if (lastResultsContainer) {
    lastResultsContainer.scrollLeft = lastResultsContainer.scrollWidth;
  }
});

window.addEventListener('load', () => {
  const lastResultsContainer = document.getElementById('mobile-last-results');
  if (lastResultsContainer) {
    lastResultsContainer.scrollLeft = lastResultsContainer.scrollWidth;
  }
});
