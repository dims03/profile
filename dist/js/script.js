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
const navLinks = document.querySelectorAll(
  'nav a[href^="#home"]',
);
const aboutLinks = document.querySelectorAll(
  'nav a[href^="#about"]',
);
const portfolioLinks = document.querySelectorAll(
  'nav a[href^="#portfolio"]',
);
const locationLinks = document.querySelectorAll(
  'nav a[href^="#location"]',
);
const techLinks = document.querySelectorAll(
  'nav a[href^="#tech"]',
);
const contactLinks = document.querySelectorAll(
  'nav a[href^="#contact"]',
);

// Combine all navigation links into a single array
const allNavLinks = [
  ...navLinks,
  ...aboutLinks,
  ...techLinks,
  ...portfolioLinks,
  ...contactLinks,
  ...locationLinks,
];

// Add click event listener to each navigation link
allNavLinks.forEach((navLink) => {
  navLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior

    const target = document.querySelector(
      this.getAttribute("href"),
    ); // Get the target section

    if (target) {
      // Scroll to the target section smoothly
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// Contact google spreadsheet

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzXPqG0188luPVF5A8l0i_dGnDnUHHdpCeUjuY0QjfBoVvOOPWiwewFXCgalaaXR_iT/exec";
const form = document.forms["submit-to-google-sheet"];

if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document
      .getElementById("name")
      .value.trim();
    const email = document
      .getElementById("email")
      .value.trim();
    const message = document
      .getElementById("message")
      .value.trim();
    const submitButton = form.querySelector(
      'button[type="submit"]',
    );

    if (!name || !email || !message) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all fields first.",
        background: "#07111f",
        color: "#fff",
      });
      return;
    }

    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    Swal.fire({
      title: "Sending...",
      text: "Please wait a moment.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "#07111f",
      color: "#fff",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(scriptURL, {
        method: "POST",
        body: new FormData(form),
      });

      const result = await response.json();
      console.log(result);

      if (result.result === "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your message has been sent successfully.",
          background: "#07111f",
          color: "#fff",
        });

        form.reset();
      } else {
        throw new Error(
          result.message || "Failed to send form",
        );
      }
    } catch (error) {
      console.error("Error:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Message failed to send. Please try again.",
        background: "#07111f",
        color: "#fff",
      });
    } finally {
      submitButton.disabled = false;
      submitButton.innerText = "Send";
    }
  });
}

//  Click above hamburger
window.addEventListener("click", function (e) {
  if (e.target != hamburger && e.target != navMenu) {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("hidden");
  }
});

// Smooth scroll ke atas saat klik tombol #to-top
document
  .querySelector("#to-top")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
