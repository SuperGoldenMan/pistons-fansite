document.addEventListener("DOMContentLoaded", function () {
    let side1 = document.getElementById('side1');
    let side2 = document.getElementById('side2');
    let landing = document.getElementById('landing');
    let body = document.body;

    window.addEventListener("scroll", function () {
        let scrollY = window.scrollY;
        let scrollProgress = Math.min(scrollY / window.innerHeight, 1); // Normalize between 0 and 1
        let moveDistance = scrollProgress * window.innerWidth;

        // Move the split animation
        side1.style.left = -moveDistance + "px";
        side2.style.left = moveDistance + "px";

        // 🔹 Once scrolling reaches 100vh, allow the background to scroll
        if (scrollY >= window.innerHeight) {
            body.classList.add("scrolling"); // Enables scrolling effect
        } else {
            body.classList.remove("scrolling"); // Locks background in place
        }
    });
});
