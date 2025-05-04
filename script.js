// script.js
// (Handles preloader, navigation, slide-out panel, THEME TOGGLE, AUDIO, and MODAL)

document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selection ---
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
    const bgMusic = document.getElementById('background-music');
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const audioErrorMessage = document.getElementById('audio-error-message');
    const projectModal = document.getElementById('project-modal');
    const projectCards = document.querySelectorAll('.project-card[data-modal-target]');
    const modalCloseBtns = document.querySelectorAll('[data-modal-close]');

    // --- Check for essential elements ---
    if (!pageWrapper) console.error("pageWrapper not found.");
    if (!requestPanel) console.error("requestPanel not found.");
    if (!panelOverlay) console.error("panelOverlay not found.");
    if (!projectModal) console.error("project-modal not found.");

    // --- Project Data (Ensure paths in assets/projects/ are correct) ---
    const projectDetails = {
        project1: {
            title: "ATM Withdrawal Simulation",
            image: "assets/projects/atm_screenshot.png", // Confirm path
            description: "A command-line application built with C# that simulates the process of withdrawing cash from an ATM. The user inputs the desired amount, and the program calculates the optimal combination of banknotes (e.g., 1000s, 500s, 200s, 100s) to dispense. It includes basic input validation.",
            tech: "C#, .NET Console Application",
            challenges: "Handling edge cases like amounts not dispensable with available notes and ensuring correct calculation logic were key challenges. Improved understanding of basic algorithms and user input handling.",
            liveLink: null,
            repoLink: "https://github.com/Vojtik1112/MyPage/tree/main/projects/project1" // Confirm link
        },
        project2: {
            title: "Objednávka Trička (T-Shirt Order Form)",
            image: "assets/projects/tshirt_screenshot.png", // Confirm path
            description: "A simple web form developed using HTML, CSS, and JavaScript for ordering custom t-shirts. It allows users to enter their name, email, choose a size, color, and specify custom text for the shirt. Includes client-side JavaScript validation to ensure required fields are filled correctly.",
            tech: "HTML, CSS, JavaScript",
            challenges: "Implementing robust client-side validation and ensuring cross-browser compatibility for the form elements. Practiced DOM manipulation and event handling in JavaScript.",
            liveLink: "projects/project2/index.html", // Confirm path relative to main HTML
            repoLink: "https://github.com/Vojtik1112/MyPage/tree/main/projects/project2" // Confirm link
        },
        project3: {
            title: "Interactive Keyboard Layout",
            image: "assets/projects/keyboard_screenshot.png", // Confirm path
            description: "A visual representation of a standard keyboard layout created purely with HTML and CSS. This project focused on structuring content semantically using HTML and applying CSS for precise layout, styling, and visual appearance. Potential future enhancement includes adding JavaScript for key press feedback.",
            tech: "HTML, CSS",
            challenges: "Achieving accurate key positioning and spacing using CSS, particularly flexbox or grid layouts. Reinforced understanding of HTML structure and CSS selectors.",
            liveLink: "projects/project3/index.html", // Confirm path relative to main HTML
            repoLink: "https://github.com/Vojtik1112/MyPage/tree/main/projects/project3" // Confirm link
        }
    };

    let elementToFocusOnPanelClose = null; // For restoring focus after panel closes
    let elementToFocusOnModalClose = null; // For restoring focus after modal closes

    // --- Preloader Logic ---
    const letters = {
        c1: document.getElementById('letter-c1'), // 'V'
        b: document.getElementById('letter-b')    // 'N'
    };
    function showLetter(letterElement) {
        if (letterElement) {
            letterElement.style.animationPlayState = 'running';
            letterElement.classList.add('visible');
        }
    }

    if (preloader) {
        // Pause animations initially
        if (letters.c1) letters.c1.style.animationPlayState = 'paused';
        if (letters.b) letters.b.style.animationPlayState = 'paused';

        // Sequence the letter animations
        setTimeout(() => showLetter(letters.c1), 100);
        setTimeout(() => showLetter(letters.b), 900);

        // Hide preloader after animations and show page
        setTimeout(() => {
            preloader.classList.add('hidden');
            if (pageWrapper) pageWrapper.classList.add('visible');

            // --- Attempt to autoplay audio ---
            attemptAudioAutoplay();
            // --- End Autoplay Attempt ---

            // Clean up preloader from DOM after transition
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 800); // Match CSS opacity transition duration
        }, 1800); // Total duration for animations to complete
    } else {
        // If no preloader, show page immediately and try autoplay
        if (pageWrapper) pageWrapper.classList.add('visible');
        attemptAudioAutoplay();
    }


    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                let isHomeSectionActive = false; // Track if home is becoming active

                // Update Sections Visibility and ARIA states
                contentSections.forEach(s => {
                    const isActive = s.id === targetId;
                    s.classList.toggle('active', isActive);
                    s.setAttribute('aria-hidden', String(!isActive)); // Use "true" or "false" string
                    if (isActive && s.id === 'home-section') {
                        isHomeSectionActive = true; // Home section is now active
                    }
                });

                // *** Control Tesseract Animation ***
                if (typeof window.setTesseractActive === 'function') {
                    window.setTesseractActive(isHomeSectionActive);
                } else {
                    // console.warn("setTesseractActive function not found on window.");
                }
                // *** End Tesseract Control ***

                // Update Nav Links Active State and ARIA current
                navLinks.forEach(l => {
                    const isCurrent = l === link;
                    l.classList.toggle('active', isCurrent);
                    if (isCurrent) {
                        l.setAttribute('aria-current', 'page');
                    } else {
                        l.removeAttribute('aria-current');
                    }
                });
            } else {
                console.warn(`Navigation target section not found: #${targetId}`);
            }
        });
    });

    // Set initial Tesseract state based on the default active section
    if (typeof window.setTesseractActive === 'function') {
        const initialActiveSection = document.querySelector('.content-section.active');
        window.setTesseractActive(initialActiveSection && initialActiveSection.id === 'home-section');
    }

    // --- Request Panel Logic ---
    function openPanel() {
        if (!requestPanel || !panelOverlay) return;

        elementToFocusOnPanelClose = document.activeElement; // Store focus
        requestPanel.setAttribute('aria-hidden', 'false');
        panelOverlay.setAttribute('aria-hidden', 'false');
        requestPanel.classList.add('open');
        panelOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus management: Focus first focusable element in panel
        const firstFocusable = requestPanel.querySelector('a[href], button:not([disabled]), textarea, input, select');
        if (firstFocusable) {
            firstFocusable.focus();
        } else if (closeRequestPanelBtn) {
            closeRequestPanelBtn.focus(); // Fallback to close button
        }

        requestPanel.addEventListener('keydown', trapFocusInPanel); // Add focus trap
    }

    function closePanel() {
        if (!requestPanel || !panelOverlay) return;

        requestPanel.classList.remove('open');
        panelOverlay.classList.remove('active');
        requestPanel.setAttribute('aria-hidden', 'true');
        panelOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scroll

        requestPanel.removeEventListener('keydown', trapFocusInPanel); // Remove focus trap

        // Restore focus
        if (elementToFocusOnPanelClose && typeof elementToFocusOnPanelClose.focus === 'function') {
            elementToFocusOnPanelClose.focus();
        }
        elementToFocusOnPanelClose = null;
    }

    // Focus Trap function for Panel
    function trapFocusInPanel(e) {
        if (e.key !== 'Tab' || !requestPanel) return;

        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
        const focusableElements = Array.from(requestPanel.querySelectorAll(focusableElementsString));
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

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

    // Event listeners for panel
    if (openRequestPanelBtn) openRequestPanelBtn.addEventListener('click', openPanel);
    if (closeRequestPanelBtn) closeRequestPanelBtn.addEventListener('click', closePanel);
    if (panelOverlay) panelOverlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && requestPanel?.classList.contains('open')) {
            closePanel();
        }
    });

    // --- Theme Toggle Logic ---
    const lightModeIcon = '☀️';
    const darkModeIcon = '🌙';
    const lightTesseractColor = 0x000000; // Black
    const darkTesseractColor = 0xcccccc;  // Light gray

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (themeIconSpan) themeIconSpan.textContent = lightModeIcon;
            // Check if function exists before calling
            if (typeof window.updateTesseractColor === 'function') {
                window.updateTesseractColor(darkTesseractColor);
            }
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            if (themeIconSpan) themeIconSpan.textContent = darkModeIcon;
            // Check if function exists before calling
            if (typeof window.updateTesseractColor === 'function') {
                window.updateTesseractColor(lightTesseractColor);
            }
            localStorage.setItem('theme', 'light');
        }
    }

    function toggleTheme() {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Initial Theme Load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    // Add listener to button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    } else {
        console.warn("Theme toggle button not found.");
    }

    // Optional: Listen for system preference changes ONLY if no theme is saved
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!localStorage.getItem('theme')) { // Only update if user hasn't set a preference
                applyTheme(event.matches ? 'dark' : 'light');
            }
        });
    } catch (e) {
        console.warn("Error setting up prefers-color-scheme listener:", e);
    }


    // --- Audio Control Logic ---
    function showAudioError(message) {
        if (audioErrorMessage) {
            audioErrorMessage.textContent = message;
            audioErrorMessage.classList.add('visible');
            // Hide after 5 seconds
            setTimeout(() => audioErrorMessage.classList.remove('visible'), 5000);
        } else {
            console.warn("Audio error message element not found.");
        }
    }

    function updateAudioButton(isPlaying) {
        if (playIcon && pauseIcon && audioToggleBtn) {
            playIcon.classList.toggle('hidden', isPlaying);
            pauseIcon.classList.toggle('hidden', !isPlaying);
            audioToggleBtn.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
        }
    }

    function attemptAudioAutoplay() {
        if (bgMusic && bgMusic.paused) {
            // Delay slightly to ensure user interaction context might be available
            setTimeout(() => {
                bgMusic.play().then(() => {
                    updateAudioButton(true);
                    console.log("Audio autoplay successful.");
                }).catch(err => {
                    console.warn('Audio autoplay failed:', err.name);
                    updateAudioButton(false);
                    // Don't show error on initial failed autoplay, only on user click fail
                });
            }, 100);
        } else if (bgMusic && !bgMusic.paused) {
            updateAudioButton(true); // Ensure button is correct if already playing
        }
    }


    function toggleAudio() {
        if (!bgMusic) return;
        if (audioErrorMessage) audioErrorMessage.classList.remove('visible'); // Hide previous errors

        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                updateAudioButton(true);
            }).catch(err => {
                console.error('Audio play failed on toggle:', err);
                updateAudioButton(false);
                let message = 'Unable to play audio. Please check browser settings or try again.';
                if (err.name === 'NotAllowedError') {
                    message = 'Audio playback requires user interaction first (e.g., click anywhere).';
                }
                showAudioError(message);
            });
        } else {
            bgMusic.pause();
            updateAudioButton(false);
        }
    }

    // Add listeners only if all audio elements exist
    if (audioToggleBtn && bgMusic && playIcon && pauseIcon) {
        audioToggleBtn.addEventListener('click', toggleAudio);

        // Sync button state with audio events
        bgMusic.addEventListener('play', () => updateAudioButton(true));
        bgMusic.addEventListener('pause', () => updateAudioButton(false)); // Catches pauses including end
        bgMusic.addEventListener('ended', () => updateAudioButton(false));

        // Initial button state check (in case it's already playing somehow)
        updateAudioButton(!bgMusic.paused);

    } else {
        console.warn("Audio control elements missing. Audio controls disabled.");
        if (audioToggleBtn) audioToggleBtn.style.display = 'none'; // Hide button if incomplete
    }

    // --- Project Modal Logic ---
    function openProjectModal(projectId) {
        const details = projectDetails[projectId];
        if (!details || !projectModal) return;

        elementToFocusOnModalClose = document.activeElement; // Store focus

        // Populate modal content
        const titleEl = projectModal.querySelector('#project-modal-title');
        const imgEl = projectModal.querySelector('#project-modal-image');
        const descEl = projectModal.querySelector('#project-modal-description');
        const techEl = projectModal.querySelector('#project-modal-tech');
        const chalEl = projectModal.querySelector('#project-modal-challenges');
        const liveLinkEl = projectModal.querySelector('#project-modal-live-link');
        const repoLinkEl = projectModal.querySelector('#project-modal-repo-link');

        if (titleEl) titleEl.textContent = details.title;
        if (descEl) descEl.innerHTML = details.description; // Use innerHTML if description contains formatting
        if (techEl) techEl.textContent = details.tech;
        if (chalEl) chalEl.textContent = details.challenges;

        // Handle image
        if (imgEl) {
            if (details.image) {
                imgEl.src = details.image;
                // *** Set descriptive alt text ***
                imgEl.alt = `Screenshot of the ${details.title} project`;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
                imgEl.alt = ''; // Clear alt text if no image
            }
        }

        // Handle links
        [liveLinkEl, repoLinkEl].forEach(linkEl => {
            if (linkEl) {
                const linkType = linkEl.id.includes('live') ? 'liveLink' : 'repoLink';
                if (details[linkType]) {
                    linkEl.href = details[linkType];
                    linkEl.style.display = 'inline-block';
                } else {
                    linkEl.style.display = 'none';
                }
            }
        });

        // Open the modal
        projectModal.setAttribute('aria-hidden', 'false');
        projectModal.classList.add('open');

        // Focus management: Focus the close button first for accessibility
        const focusTarget = projectModal.querySelector('.modal-close-btn') || projectModal.querySelector('a[href], button');
        if (focusTarget) {
            focusTarget.focus();
        }
        // Add focus trap listener for modal
        projectModal.addEventListener('keydown', trapFocusInModal);
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        projectModal.removeEventListener('keydown', trapFocusInModal); // Remove trap

        // Restore focus
        if (elementToFocusOnModalClose && typeof elementToFocusOnModalClose.focus === 'function') {
            elementToFocusOnModalClose.focus();
        }
        elementToFocusOnModalClose = null;
    }

    // Focus Trap function for Modal
    function trapFocusInModal(e) {
        if (e.key !== 'Tab' || !projectModal) return;

        const focusableElementsString = 'a[href], button:not([disabled]), textarea, input, select';
        // Find focusable elements *within the modal content*
        const modalContent = projectModal.querySelector('.modal-content');
        if (!modalContent) return;

        const focusableElements = Array.from(modalContent.querySelectorAll(focusableElementsString));
        if (focusableElements.length === 0) return;

        // Ensure the close button is included if it's outside .modal-content but logically part of modal
        const closeBtn = projectModal.querySelector('.modal-close-btn');
        if (closeBtn && !focusableElements.includes(closeBtn)) {
            focusableElements.unshift(closeBtn); // Add close button to the start
        }

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

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


    // Add listeners to project cards
    projectCards.forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        if (!projectId) {
            console.warn("Project card missing data-project-id:", card);
            return;
        }

        card.addEventListener('click', () => {
            openProjectModal(projectId);
        });

        // Keyboard accessibility
        if (card.tagName !== 'A') { // Only add if not already a link
            card.setAttribute('tabindex', '0'); // Make focusable
            card.setAttribute('role', 'button'); // Define role
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent space bar scroll
                    openProjectModal(projectId);
                }
            });
        } else {
            // If it's a link, prevent default click if it's just opening modal
            card.addEventListener('click', (e) => {
                if (card.getAttribute('href') === '#') { // Or check data-modal-target presence
                    e.preventDefault();
                    openProjectModal(projectId);
                }
            });
        }

    });

    // Add listeners to modal close buttons/overlay
    modalCloseBtns.forEach(button => {
        button.addEventListener('click', closeProjectModal);
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal?.classList.contains('open')) {
            closeProjectModal();
        }
    });

    // --- End Project Modal Logic ---

}); // End of DOMContentLoaded