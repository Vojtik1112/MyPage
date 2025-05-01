// script.js
// (Handles preloader, navigation, slide-out panel, AND THEME TOGGLE)

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const pageWrapper = document.getElementById('page-wrapper');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const openRequestPanelBtn = document.getElementById('open-request-panel');
    const closeRequestPanelBtn = document.getElementById('close-request-panel');
    const requestPanel = document.getElementById('request-panel');
    const panelOverlay = document.getElementById('panel-overlay');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // --- Preloader Logic ---
    const letters = {
        c1: document.getElementById('letter-c1'), // Corresponds to 'V'
        b: document.getElementById('letter-b')    // Corresponds to 'N'
    };
    function showLetter(letterElement) {
        if (letterElement) {
            letterElement.style.animationPlayState = 'running';
            letterElement.classList.add('visible');
        }
    }

    // Start animations manually
    if (letters.c1) letters.c1.style.animationPlayState = 'paused';
    if (letters.b) letters.b.style.animationPlayState = 'paused';

    // Sequence the letter animations
    setTimeout(() => showLetter(letters.c1), 100);
    setTimeout(() => showLetter(letters.b), 900);

    // Hide preloader after animations
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('hidden');
        }
        if (pageWrapper) {
            pageWrapper.classList.add('visible');
        }

        // START MUSIC AFTER INTRO
        const bgMusic = document.getElementById('background-music');
        if (bgMusic) {
            bgMusic.play().catch(err => {
                // Autoplay might be blocked; you could show a “▶” button instead
                console.warn('Audio play failed:', err);
            });
        }

        // Clean up preloader from DOM after transition
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 800);
    }, 1800); // Adjusted timeout duration for fewer letters

    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                navLinks.forEach(l => l.classList.remove('active'));
                contentSections.forEach(s => s.classList.remove('active'));
                link.classList.add('active');
                targetSection.classList.add('active');
            }
        });
    });

    // --- Request Panel Logic ---
    function openPanel() {
        requestPanel.classList.add('open');
        panelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePanel() {
        requestPanel.classList.remove('open');
        panelOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore default overflow

        // Give time for the panel animation to complete before enabling scroll
        setTimeout(() => {
            if (!requestPanel.classList.contains('open')) {
                document.body.style.overflow = '';
            }
        }, 400); // Match the transition duration
    }

    if (openRequestPanelBtn) {
        openRequestPanelBtn.addEventListener('click', openPanel);
    }
    if (closeRequestPanelBtn) {
        closeRequestPanelBtn.addEventListener('click', closePanel);
    }
    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanel);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && requestPanel.classList.contains('open')) {
            closePanel();
        }
    });


    // --- Theme Toggle Logic ---
    const lightModeIcon = '☀️';
    const darkModeIcon = '🌙';
    const lightTesseractColor = 0x000000; // Black (match CSS --tesseract-line-color light)
    const darkTesseractColor = 0xcccccc;  // Light grey (match CSS --tesseract-line-color dark)

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = lightModeIcon + ' BETA'; // Show sun icon + BETA
            // Update tesseract color if the function exists (i.e., tesseract.js loaded)
            if (typeof window.updateTesseractColor === 'function') {
                window.updateTesseractColor(darkTesseractColor);
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = darkModeIcon + ' BETA'; // Show moon icon + BETA
            if (typeof window.updateTesseractColor === 'function') {
                window.updateTesseractColor(lightTesseractColor);
            }
            localStorage.setItem('theme', 'light');
        }
    }

    function toggleTheme() {
        if (body.classList.contains('dark-mode')) {
            applyTheme('light');
        } else {
            applyTheme('dark');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // --- Initial Theme Load ---
    // Check local storage first, then system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Default to light
    }

    // Optional: Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // Only change if no theme is explicitly saved by the user
        if (!localStorage.getItem('theme')) {
            applyTheme(event.matches ? 'dark' : 'light');
        }
    });
    // --- End Theme Toggle Logic ---


}); // End of DOMContentLoaded