document.querySelectorAll('.navbar nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetId = this.getAttribute('href'); 
            const targetElement = document.querySelector(targetId); 

            
            targetElement.scrollIntoView({
                behavior: 'smooth', 
                block: 'start' 
            });
        });
    });

document.querySelectorAll('.mobile-menu nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); 
        const targetId = this.getAttribute('href'); 
        const targetElement = document.querySelector(targetId); 

        
        targetElement.scrollIntoView({
            behavior: 'smooth', 
            block: 'start' 
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const scrollThreshold = window.innerHeight;
  
    // Initially hide the navbar
    navbar.style.transform = "translateY(-100%)";
    navbar.style.transition = "transform 0.3s ease-in-out";
  
    window.addEventListener("scroll", function () {
      if (window.scrollY > scrollThreshold) {
        navbar.style.transform = "translateY(0)";
      } else {
        navbar.style.transform = "translateY(-100%)";
      }
    });
  });
  