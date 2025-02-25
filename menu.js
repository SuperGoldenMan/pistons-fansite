// Constants
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu"); // Fix: Use dot for class
const closeMenuButton = document.getElementById("close-menu");

// Attach event listeners after DOM loads
document.addEventListener("DOMContentLoaded", function () {
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener("click", toggleMenu);
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener("click", closeMenu);
    }
});

// Functions
function toggleMenu() {
    mobileMenu.classList.toggle("display-menu");
}

function closeMenu() {
    mobileMenu.classList.remove("display-menu"); // Fix: Remove 'display-menu' instead of toggling 'mobile-menu'
}
