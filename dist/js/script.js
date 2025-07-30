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
  const toTop = document.querySelector("#to-top");

  if (window.scrollY > fixedNav) {
    header.classList.add("navbar=fixed");
    toTop.classList.remove("hidden");
    toTop.classList.add("flex");
  } else {
    header.classList.remove("navbar-fixed");
    toTop.classList.remove("flex");
    toTop.classList.add("remove");
  }
};

// Smooth scrolling

// Select all navigation links that should trigger smooth scroll
const navLinks = document.querySelectorAll('nav a[href^="#home"]');
const aboutLinks = document.querySelectorAll('nav a[href^="#about"]');
const portfolioLinks = document.querySelectorAll('nav a[href^="#portfolio"]');
const techLinks = document.querySelectorAll('nav a[href^="#tech"]');
const contactLinks = document.querySelectorAll('nav a[href^="#contact"]');

// Combine all navigation links into a single array
const allNavLinks = [...navLinks, ...aboutLinks, ...techLinks, ...portfolioLinks, ...contactLinks];

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

// Contact google spreadsheet

const scriptURL = "https://script.google.com/macros/s/AKfycbzXPqG0188luPVF5A8l0i_dGnDnUHHdpCeUjuY0QjfBoVvOOPWiwewFXCgalaaXR_iT/exec";
const form = document.forms["submit-to-google-sheet"];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => console.log("Success!", response))
    .catch((error) => console.error("Error!", error.message));
});

// Contact form refresh and pop up

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Simulate form submission to Google Sheets
    // You can add your own logic here to send the form data to your desired destination

    // Show a popup message
    alert("Form has been sent!");

    // Clear form fields
    form.reset();
  });
});

//  Click above hamburger
window.addEventListener("click", function (e) {
  if (e.target != hamburger && e.target != navMenu) {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
  }
});

// Smooth scroll ke atas saat klik tombol #to-top
document.querySelector("#to-top").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  
});
