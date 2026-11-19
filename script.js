/**
 * Personal Website – Resume and Bio-data
 * Author: Anushree Ajjappa Mangalgatti
 * Script: Theme toggle with localStorage persistence, responsive mobile menu,
 *         print/PDF support, automatic copyright year, and interactive UI effects.
 */

const THEME_STORAGE_KEY = "anushree-portfolio-theme";

/**
 * Safely reads the saved theme from localStorage.
 * Returns "dark" or "light" (defaults to "light").
 * @returns {"light" | "dark"}
 */
function getSavedTheme() {
    try {
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
        return stored === "dark" ? "dark" : "light";
    } catch (error) {
        return "light";
    }
}

/**
 * Safely persists the user's selected theme in localStorage.
 * @param {"light" | "dark"} theme
 */
function saveTheme(theme) {
    try {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        // Ignore storage errors if cookies/storage are restricted in the browser
    }
}

/**
 * Applies the specified theme to the root <html> element and updates
 * the toggle button's accessible label and state.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
    const root = document.documentElement;
    const isDark = theme === "dark";

    if (isDark) {
        root.setAttribute("data-theme", "dark");
    } else {
        root.removeAttribute("data-theme");
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) {
        return;
    }

    toggleBtn.setAttribute("aria-pressed", String(isDark));
    toggleBtn.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    const labelSpan = toggleBtn.querySelector(".theme-label");
    if (labelSpan) {
        labelSpan.textContent = isDark ? "Light" : "Dark";
    }
}

/* Apply the saved theme immediately so navigating between pages stays seamless */
applyTheme(getSavedTheme());

/**
 * Initializes the dark/light mode toggle button.
 */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    if (!toggleBtn) {
        return;
    }

    // Sync button state after DOM is ready
    applyTheme(getSavedTheme());

    toggleBtn.addEventListener("click", () => {
        const currentlyDark = document.documentElement.getAttribute("data-theme") === "dark";
        const nextTheme = currentlyDark ? "light" : "dark";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
    });
}

/**
 * Initializes the responsive mobile navigation menu toggle.
 * Handles opening/closing via button click, link click, Escape key, and outside clicks.
 */
function initMobileMenu() {
    const navToggle = document.getElementById("nav-toggle");
    const primaryNav = document.getElementById("primary-navigation");

    if (!navToggle || !primaryNav) {
        return;
    }

    const setMenuState = (isOpen) => {
        primaryNav.classList.toggle("is-open", isOpen);
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    };

    navToggle.addEventListener("click", () => {
        const isCurrentlyOpen = primaryNav.classList.contains("is-open");
        setMenuState(!isCurrentlyOpen);
    });

    // Close menu when a navigation link is selected on mobile
    primaryNav.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
            setMenuState(false);
        });
    });

    // Close menu when pressing Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
            setMenuState(false);
            navToggle.focus();
        }
    });

    // Close menu when clicking outside the header
    document.addEventListener("click", (event) => {
        const header = document.querySelector(".site-header");
        if (
            header &&
            primaryNav.classList.contains("is-open") &&
            !header.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    // Reset mobile menu state if viewport expands to desktop width
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768 && primaryNav.classList.contains("is-open")) {
            setMenuState(false);
        }
    });
}

/**
 * Attaches print/Save-as-PDF handlers for the Resume and Bio-data buttons.
 */
function initPrintButtons() {
    const printButtonIds = ["print-resume-btn", "print-biodata-btn"];

    printButtonIds.forEach((buttonId) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", () => {
                window.print();
            });
        }
    });
}

/**
 * Updates the footer copyright year automatically using the current system year.
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById("current-year");
    if (yearElement) {
        yearElement.textContent = String(new Date().getFullYear());
    }
}

/**
 * Initializes smooth scrolling, the back-to-top button, scroll-reveal animations,
 * and the interactive welcome note dialog on the home page.
 */
function initInteractiveEffects() {
    initBackToTop();
    initScrollReveal();
    initWelcomeModal();
}

/**
 * Controls visibility and smooth scrolling of the Back to Top button.
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) {
        return;
    }

    const toggleVisibility = () => {
        if (window.scrollY > 260) {
            backToTopBtn.classList.add("is-visible");
        } else {
            backToTopBtn.classList.remove("is-visible");
        }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/**
 * Marks sections with `.is-visible` as they enter the viewport for subtle
 * interactive emphasis without ever hiding content off-screen.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((el) => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.08 }
    );

    revealElements.forEach((el) => observer.observe(el));
}

/**
 * Opens and closes the accessible Welcome Note modal on index.html.
 */
function initWelcomeModal() {
    const welcomeBtn = document.getElementById("welcome-btn");
    const modalBackdrop = document.getElementById("welcome-modal");
    const modalCloseBtn = document.getElementById("welcome-modal-close");

    if (!welcomeBtn || !modalBackdrop || !modalCloseBtn) {
        return;
    }

    const openModal = () => {
        modalBackdrop.classList.add("is-open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        modalCloseBtn.focus();
    };

    const closeModal = () => {
        modalBackdrop.classList.remove("is-open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        welcomeBtn.focus();
    };

    welcomeBtn.addEventListener("click", openModal);
    modalCloseBtn.addEventListener("click", closeModal);

    modalBackdrop.addEventListener("click", (event) => {
        if (event.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modalBackdrop.classList.contains("is-open")) {
            closeModal();
        }
    });
}

/* Initialize all functionality once the HTML document is parsed */
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initMobileMenu();
    initPrintButtons();
    updateCopyrightYear();
    initInteractiveEffects();
});
