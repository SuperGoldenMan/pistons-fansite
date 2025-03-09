let side1 = document.getElementById('side1');
let side2 = document.getElementById('side2');

window.addEventListener('scroll', function() {
    let scrollValue = Math.min(window.pageYOffset / window.innerHeight, 1); // Normalize between 0 and 1
    let moveDistance = scrollValue * window.innerWidth; // Move based on full screen width

    side1.style.left = -moveDistance + 'px';
    side2.style.left = moveDistance + 'px';
});
