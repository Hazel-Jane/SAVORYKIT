
    const mobileBtn = document.querySelector(".mobile-menu-button");
    const navLinks = document.querySelector(".nav-links");

    mobileBtn.addEventListener("click", () => {
        navLinks.classList.toggle("show");
    });

