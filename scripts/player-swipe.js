document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".player-slide");
    const scrollBar = document.querySelector(".scroll-bar");
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) {
                slide.classList.add("active");
            }
        });

        // Update progress indicator
        const progress = ((index + 1) / slides.length) * 100;
        scrollBar.style.width = `${progress}%`;
    }

    // Swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe Left (Next Player)
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        } else if (touchEndX > touchStartX) {
            // Swipe Right (Previous Player)
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        }
    }

    // Show first player by default
    showSlide(currentIndex);
});
