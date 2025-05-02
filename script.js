// script.js
// (Handles preloader, navigation, slide-out panel, THEME TOGGLE, AND AUDIO)

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
    const themeIconSpan = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
    const body = document.body;
    const bgMusic = document.getElementById('background-music'); // Get audio element
    const audioToggleBtn = document.getElementById('audio-toggle-btn'); // Get audio button
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const panelFirstFocusable = document.getElementById('panel-first-focusable'); // First focusable element in panel
    const audioErrorMessage = document.getElementById('audio-error-message'); // Get error message div

    // --- Check if essential elements exist ---
    if (!pageWrapper || !requestPanel || !panelOverlay) {
        console.error("Essential layout elements (pageWrapper, requestPanel, panelOverlay) not found. Some functionality might be broken.");
    }

    let elementToFocusOnPanelClose = null; // To store the element that opened the panel

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
                // Update Sections
                contentSections.forEach(s => {
                    const isActive = s.id === targetId;
                    s.classList.toggle('active', isActive);
                    s.setAttribute('aria-hidden', !isActive); // Toggle aria-hidden
                });

                // Update Nav Links
                navLinks.forEach(l => {
                    const isCurrent = l === link;
                    l.classList.toggle('active', isCurrent);
                    if (isCurrent) {
                        l.setAttribute('aria-current', 'page'); // Set aria-current
                    } else {
                        l.removeAttribute('aria-current'); // Remove aria-current
                    }
                });
            }
        });
    });

    // --- Request Panel Logic ---
    function openPanel() {
        if (!requestPanel || !panelOverlay) return; // Guard clause

        elementToFocusOnPanelClose = document.activeElement; // Store currently focused element
        requestPanel.classList.add('open');
        requestPanel.removeAttribute('aria-hidden'); // Make accessible
        panelOverlay.classList.add('active');
        panelOverlay.removeAttribute('aria-hidden'); // Make accessible
        document.body.style.overflow = 'hidden';

        // Focus management
        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = requestPanel.querySelectorAll(focusableElementsString);
        const firstFocusable = focusableElements[0] || closeRequestPanelBtn; // Fallback to close button
        const lastFocusable = focusableElements[focusableElements.length - 1] || closeRequestPanelBtn;

        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Add focus trap listener
        requestPanel.addEventListener('keydown', trapFocus);
    }

    function closePanel() {
        if (!requestPanel || !panelOverlay) return; // Guard clause

        requestPanel.classList.remove('open');
        requestPanel.setAttribute('aria-hidden', 'true'); // Hide from accessibility tree
        panelOverlay.classList.remove('active');
        panelOverlay.setAttribute('aria-hidden', 'true'); // Hide from accessibility tree
        document.body.style.overflow = ''; // Restore default overflow

        // Remove focus trap listener
        requestPanel.removeEventListener('keydown', trapFocus);

        // Restore focus to the element that opened the panel
        if (elementToFocusOnPanelClose) {
            elementToFocusOnPanelClose.focus();
            elementToFocusOnPanelClose = null; // Clear reference
        }
    }

    // Focus Trap function
    function trapFocus(e) {
        if (e.key !== 'Tab') return;
        if (!requestPanel) return; // Should not happen if listener is attached correctly

        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
        const focusableElements = requestPanel.querySelectorAll(focusableElementsString);
        const firstFocusable = focusableElements[0] || closeRequestPanelBtn;
        const lastFocusable = focusableElements[focusableElements.length - 1] || closeRequestPanelBtn;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    // Add listeners only if elements exist
    if (openRequestPanelBtn) {
        openRequestPanelBtn.addEventListener('click', openPanel);
    } else {
        console.warn("Open request panel button not found.");
    }

    if (closeRequestPanelBtn) {
        closeRequestPanelBtn.addEventListener('click', closePanel);
    } else {
        console.warn("Close request panel button not found.");
    }

    if (panelOverlay) {
        panelOverlay.addEventListener('click', closePanel);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && requestPanel && requestPanel.classList.contains('open')) {
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
            if (themeIconSpan) themeIconSpan.textContent = lightModeIcon; // Show sun icon
            // Update tesseract color if the function exists (i.e., tesseract.js loaded)
            if (typeof window.updateTesseractColor === 'function') {
                window.updateTesseractColor(darkTesseractColor);
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeIconSpan) themeIconSpan.textContent = darkModeIcon; // Show moon icon
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
    } else {
        console.warn("Theme toggle button not found.");
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

    // --- Audio Control Logic ---
    function toggleAudio() {
        if (!bgMusic) return;

        // Hide any previous error messages
        if (audioErrorMessage) {
            audioErrorMessage.classList.remove('visible');
        }

        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                // Update button on successful play
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
                audioToggleBtn.setAttribute('aria-label', 'Pause background music');
            }).catch(err => {
                console.warn('Audio play failed:', err);
                // Provide user feedback that play failed
                if (audioErrorMessage) {
                    // Check for NotAllowedError which often indicates user interaction needed
                    if (err.name === 'NotAllowedError') {
                         audioErrorMessage.textContent = 'Audio playback requires user interaction first. Try clicking anywhere on the page.';
                    } else {
                         audioErrorMessage.textContent = 'Unable to play audio. Please check browser settings.';
                    }
                    audioErrorMessage.classList.add('visible');
                    // Hide after 5 seconds
                    setTimeout(() => audioErrorMessage.classList.remove('visible'), 5000);
                }
                // Ensure button reflects paused state if play failed
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
                audioToggleBtn.setAttribute('aria-label', 'Play background music');
            });
        } else {
            bgMusic.pause();
            // Update button immediately on pause
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            audioToggleBtn.setAttribute('aria-label', 'Play background music');
        }
    }

    if (audioToggleBtn && bgMusic && playIcon && pauseIcon) {
        audioToggleBtn.addEventListener('click', toggleAudio);

        // Optional: Update button if music ends naturally
        bgMusic.addEventListener('ended', () => {
             playIcon.classList.remove('hidden');
             pauseIcon.classList.add('hidden');
             audioToggleBtn.setAttribute('aria-label', 'Play background music');
        });
         // Optional: Update button state if paused/played by other means (e.g. browser controls)
         bgMusic.addEventListener('pause', () => {
             if (!bgMusic.ended) { // Don't override if it just ended
                 playIcon.classList.remove('hidden');
                 pauseIcon.classList.add('hidden');
                 audioToggleBtn.setAttribute('aria-label', 'Play background music');
             }
         });
         bgMusic.addEventListener('play', () => {
             playIcon.classList.add('hidden');
             pauseIcon.classList.remove('hidden');
             audioToggleBtn.setAttribute('aria-label', 'Pause background music');
         });
    } else {
         console.warn("Audio control elements (button, audio tag, icons) not all found. Audio controls disabled.");
         // Optionally hide the button if elements are missing
         if(audioToggleBtn) audioToggleBtn.style.display = 'none';
    }
    // --- End Audio Control Logic ---

}); // End of DOMContentLoaded
