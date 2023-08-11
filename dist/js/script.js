// Hamburger

const hamburger = document.querySelector("#hamburger");
const navMenu = document.querySelector("#nav-menu");

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("hidden");
});

// Navbar Fixed

window.onscroll = function () {
  const header = document.querySelector("header");
  const fixedNav = header.offsetTop;

  if (window.scrollY > fixedNav) {
    header.classList.add("navbar=fixed");
  } else {
    header.classList.remove("navbar-fixed");
  }
};

// Smooth scrolling

// Select all navigation links that should trigger smooth scroll
const navLinks = document.querySelectorAll('nav a[href^="#home"]');
const aboutLinks = document.querySelectorAll('nav a[href^="#about"]');
const portfolioLinks = document.querySelectorAll('nav a[href^="#portfolio"]');
const contactLinks = document.querySelectorAll('nav a[href^="#contact"]');

// Combine all navigation links into a single array
const allNavLinks = [...navLinks, ...aboutLinks, ...portfolioLinks, ...contactLinks];

// Add click event listener to each navigation link
allNavLinks.forEach((navLink) => {
  navLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    const target = document.querySelector(this.getAttribute("href")); // Get the target section

    if (target) {
      // Scroll to the target section smoothly
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});
