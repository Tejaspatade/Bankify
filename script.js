"use strict";

// ------------- DOM selections
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.getElementById("section--1");
const header = document.querySelector(".header");
const tabBtn = document.querySelectorAll(".operations__tab");
const tabContent = document.querySelectorAll(".operations__content");
const tabsContainer = document.querySelector(".operations__tab-container");
const navBar = document.querySelector(".nav");
const sections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const leftBtn = document.querySelector(".slider__btn--left");
const rightBtn = document.querySelector(".slider__btn--right");
const dots = document.querySelector(".dots");

// Global Variables
let currentSlide = 0;

// ------------- Modal window --------------------------------------------------------------
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// --------------------- Cookie Element Creation -----------------------------------------------
// const cookieMsg = document.createElement("span");
// cookieMsg.classList.add("cookie-message");
// cookieMsg.innerHTML =
//     "We use cookies to analyse who visits our site.<button class='btn btn--close-cookie'>Got it!</button>";
// // header.append(cookieMsg);
// cookieMsg.style.backgroundColor = "#37383d";
// // Close Cookie Msg
// document
//     .querySelector(".btn--close-cookie")
//     .addEventListener("click", function () {
//         cookieMsg.remove();
//     });

// ------------- Smooth Scrolling
btnScrollTo.addEventListener("click", (event) => {
    // Scroll To (Old School Way) 👴🏽
    // const s1Coords = section1.getBoundingClientRect();
    // console.log(s1Coords);
    // window.scrollTo({
    //     left: s1Coords.left + window.pageXOffset,
    //     top: s1Coords.top + window.pageYOffset,
    //     behavior: "smooth",
    // });

    // Smooth Scroll (Modern Way) 👦🏽
    section1.scrollIntoView({ behavior: "smooth" });
});

// ----------------------------- Navigation Bar Smooth Scrolls -------------------------------
// document.querySelectorAll(".nav__link").forEach((navLink) => {
//     navLink.addEventListener("click", (event) => {
//         // Prevent From Reloading and Navigate to Anchor
//         event.preventDefault();
//         console.log("Link Clicked.");

//         // Determining where to scroll to
//         const sectionId = navLink.getAttribute("href");
//         document
//             .querySelector(sectionId)
//             .scrollIntoView({ behavior: "smooth" });
//     });
// });
// Event delegation Method more efficient 🤓
// 1. Add Event Listener to Common Parent Element
document.querySelector(".nav__links").addEventListener("click", (event) => {
    // 2. Determine Element that Originated the event.
    console.log(event.target);

    // Prevent From Reloading and Navigate to Anchor
    event.preventDefault();

    // Check if event generated on a nav__link
    if (event.target.classList.contains("nav__link")) {
        console.log("Link CLicked");
        const sectionId = event.target.getAttribute("href");
        document
            .querySelector(sectionId)
            .scrollIntoView({ behavior: "smooth" });
    }
});

// ------------------------------- NavBar Blur Effect --------------------------------------
// Callback Function for handling event
const navLinksOnHover = function (event) {
    // Event Delegation Check
    if (event.target.classList.contains("nav__link")) {
        // Link Hovered
        const hoveredLink = event.target;
        // Other Elements on nav bar
        const otherLinks = hoveredLink
            .closest(".nav")
            .querySelectorAll(".nav__link");
        // Logo
        const logo = hoveredLink.closest(".nav").querySelector("img");

        // Change Opacity on others
        otherLinks.forEach((link) => {
            if (link !== hoveredLink) link.style.opacity = this;
        });
        // Logo Opacity Changed
        logo.style.opacity = this;
    }
};
// Passing opacity as an argument by setting this to the opacity
navBar.addEventListener("mouseover", navLinksOnHover.bind(0.5));
navBar.addEventListener("mouseout", navLinksOnHover.bind(1));

// ------------------------------- Sticky NavBar Effect --------------------------------------
// NavBar height
const navHeight = navBar.getBoundingClientRect().height;
// Intersection Observer API
// Callback Function
const stickyNav = (entries, observer) => {
    // Destructuring entry
    const [entry] = entries;

    // Check for intersection
    if (!entry.isIntersecting) navBar.classList.add("sticky");
    else navBar.classList.remove("sticky");
};
// Create observer Object
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});
// Observe Target -> Header Section
headerObserver.observe(header);

// ------------------------------- Lazy Loading Imgs Section 1 -------------------------------
const imgs = document.querySelectorAll(".features__img");
// CallBack
const lazyLoadImg = (entries, observer) => {
    // Destructuring entry
    const [entry] = entries;

    // Guard Clause
    if (!entry.isIntersecting) return;

    // Replace lightweight img with original img.
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", () => {
        entry.target.classList.remove("lazy-img");
    });
    observer.observe(entry.target);
};
// Observer Object
const imgObserver = new IntersectionObserver(lazyLoadImg, {
    root: null,
    threshold: 0,
    rootMargin: "200px",
});
imgs.forEach((img) => imgObserver.observe(img));

// ------------------------------- Tabbed Component Section 2 -------------------------------
// Event Delegation on tabContainer
tabsContainer.addEventListener("click", (event) => {
    const activeTab = event.target.closest(".operations__tab");

    // Guard Clause
    if (!activeTab) return;

    // Set active tab
    // Removing active from all tabs
    tabBtn.forEach((tab) => {
        tab.classList.remove("operations__tab--active");
    });
    tabContent.forEach((tab) => {
        tab.classList.remove("operations__content--active");
    });

    // Adding on currently active tab
    activeTab.classList.add("operations__tab--active");
    // Selecting corresponding content
    document
        .querySelector(`.operations__content--${activeTab.dataset.tab}`)
        .classList.add("operations__content--active");
});

// ------------------------------- Reveal Sections OnScroll -------------------------------------
// Callback Function
const revealSection = function (entries, observer) {
    // Destructuring entry
    const [entry] = entries;

    // Guard Case
    if (!entry.isIntersecting) return;

    // Showing Hidden Section
    entry.target.classList.remove("section--hidden");

    // Stop Observing
    observer.unobserve(entry.target);
};
// Intersection Observer for all sections
const sectionsObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});
sections.forEach((section) => {
    sectionsObserver.observe(section);
    section.classList.add("section--hidden");
});

// ------------------------------- Slider Section 3--------------------------------------------
// Organise Slides Functionality
const goToSlide = (startSlide) => {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - startSlide) * 100}%)`;
    });
};
const constructDots = () => {
    slides.forEach((_, index) => {
        dots.insertAdjacentHTML(
            "beforeend",
            `<button class="dots__dot" data-slide="${index}"></button>`
        );
    });
};
const setActiveDot = (slideNum) => {
    // Remove active from other dots
    dots.querySelectorAll(".dots__dot").forEach((dot) => {
        dot.classList.remove("dots__dot--active");
    });
    // Set clicked dot as active
    document
        .querySelector(`.dots__dot[data-slide="${slideNum}"]`)
        .classList.add("dots__dot--active");
};
const prevSlide = () => {
    // Go to Last slide if already on first slide
    if (currentSlide === 0) currentSlide = slides.length - 1;
    else currentSlide--;
    // Display current slide upfront
    goToSlide(currentSlide);
    // Update Dots
    setActiveDot(currentSlide);
};
const nextSlide = () => {
    // Return back to 0 after reaching last slide
    if (currentSlide === slides.length - 1) currentSlide = 0;
    else currentSlide++;
    // Display current slide upfront
    goToSlide(currentSlide);
    // Update Dots
    setActiveDot(currentSlide);
};
const init = () => {
    // Generate Dots
    constructDots();
    // Set all slides in a row
    goToSlide(0);
    // Update Dots
    setActiveDot(currentSlide);
};
init();
// -> Events
// Go To Previous Slide
leftBtn.addEventListener("click", prevSlide);
// Go To Next Slide
rightBtn.addEventListener("click", nextSlide);
// Keyboard Arrow Press to move slides
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") nextSlide();
    if (event.key === "ArrowLeft") prevSlide();
});
// Dot Click using event delegation
dots.addEventListener("click", (event) => {
    // Delegation Check
    if (event.target.classList.contains("dots__dot")) {
        // Update Slider
        goToSlide(event.target.dataset.slide);

        // Active Class
        setActiveDot(event.target.dataset.slide);
    }
});

// ----------------------------------------------------------------------------------------------
