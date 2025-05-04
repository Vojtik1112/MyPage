// script.js
// (Handles preloader, navigation, slide-out panel, theme toggle, audio, modal, project data loading)

document.addEventListener('DOMContentLoaded', async () => { // Make async for await
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
    // Project cards selected later in setupProjectCards
    const modalCloseBtns = document.querySelectorAll('[data-modal-close]');

    // --- Global State ---
    let projectDetails = {}; // Will be loaded from JSON
    let elementToFocusOnPanelClose = null;
    let elementToFocusOnModalClose = null;
    const lightModeIcon = '☀️';
    const darkModeIcon = '🌙';
    const lightTesseractColor = 0x000000; // Black
    const darkTesseractColor = 0xcccccc;  // Light gray

    // --- Check for essential elements ---
    // (Add more checks as needed)
    if (!pageWrapper || !requestPanel || !panelOverlay || !projectModal) {
        console.error("One or more essential layout elements (pageWrapper, requestPanel, panelOverlay, projectModal) not found. Functionality may be limited.");
    }
    if (!themeToggleBtn || !themeIconSpan) {
        console.warn("Theme toggle button or icon span not found.");
    }
    if (!bgMusic || !audioToggleBtn || !playIcon || !pauseIcon) {
        console.warn("Audio elements (music, toggle, icons) missing. Audio controls disabled.");
        if (audioToggleBtn) audioToggleBtn.style.display = 'none';
    }

    // --- Project Data Loading ---
    async function loadProjectData() {
        try {
            // Adjust the path if your projects.json is located elsewhere
            const response = await fetch('assets/projects/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not fetch project data.`);
            }
            projectDetails = await response.json();
            console.log('Project data loaded successfully.');
            // Setup cards *after* data is loaded
            setupProjectCards();
        } catch (error) {
            console.error("Failed to load or parse project data:", error);
            // Optionally display an error to the user or disable project section
        }
    }

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
        if (letters.c1) letters.c1.style.animationPlayState = 'paused';
        if (letters.b) letters.b.style.animationPlayState = 'paused';
        setTimeout(() => showLetter(letters.c1), 100);
        setTimeout(() => showLetter(letters.b), 900);

        setTimeout(() => {
            preloader.classList.add('hidden');
            if (pageWrapper) pageWrapper.classList.add('visible');
            attemptAudioAutoplay(); // Attempt audio play after preloader fades

            // Clean up preloader
            setTimeout(() => {
                preloader.remove(); // Use remove() modern method
            }, 800); // Match CSS transition
        }, 1800);
    } else {
        // No preloader: Show page and attempt autoplay
        if (pageWrapper) pageWrapper.classList.add('visible');
        attemptAudioAutoplay();
    }

    // --- Load Project Data ---
    // Called after preloader logic starts, completes before card setup
    await loadProjectData();

    // --- Theme Toggle Logic ---
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        body.classList.toggle('dark-mode', isDark);
        if (themeIconSpan) themeIconSpan.textContent = isDark ? lightModeIcon : darkModeIcon;

        const tesseractColor = isDark ? darkTesseractColor : lightTesseractColor;
        // Dispatch custom event for Tesseract color update
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: {theme: theme, color: tesseractColor}
        });
        window.dispatchEvent(themeChangeEvent);

        localStorage.setItem('theme', theme);
        // console.log(`Theme applied: ${theme}`);
    }

    function toggleTheme() {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // Initial Theme Load
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme); // Apply initial theme

    // Add listener to button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // System preference listener (optional, only if no saved theme)
    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!localStorage.getItem('theme')) { // Only react if user hasn't manually set
                applyTheme(event.matches ? 'dark' : 'light');
            }
        });
    } catch (e) {
        console.warn("Error setting up prefers-color-scheme listener:", e);
    }


    // --- Navigation Logic ---
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                let isHomeSectionTargeted = targetId === 'home-section';

                contentSections.forEach(s => {
                    const isActive = s.id === targetId;
                    s.classList.toggle('active', isActive);
                    // *** ACCESSIBILITY NOTE: The aria-hidden attribute is crucial! ***
                    // It hides inactive sections from screen readers, preventing confusion.
                    // Setting it to 'false' for the active section makes it visible to assistive tech.
                    // DO NOT REMOVE this line or the logic.
                    s.setAttribute('aria-hidden', String(!isActive));
                });

                navLinks.forEach(l => {
                    const isCurrent = l === link;
                    l.classList.toggle('active', isCurrent);
                    l.setAttribute('aria-current', isCurrent ? 'page' : null);
                });

                // Dispatch custom event for section change (for Tesseract)
                const sectionChangeEvent = new CustomEvent('sectionChange', {
                    detail: {isHomeActive: isHomeSectionTargeted}
                });
                window.dispatchEvent(sectionChangeEvent);
                // console.log(`Navigated to: ${targetId}, Home Active: ${isHomeSectionTargeted}`);

            } else {
                console.warn(`Navigation target section not found: #${targetId}`);
            }
        });
    });

    // Set initial Tesseract state based on the default active section
    const initialActiveSection = document.querySelector('.content-section.active');
    const initialHomeActive = initialActiveSection && initialActiveSection.id === 'home-section';
    // *** ACCESSIBILITY: Ensure initial aria-hidden states are correct ***
    // The HTML should set aria-hidden="true" for all non-active sections initially.
    // This JS dispatch ensures the Tesseract animation state matches the initial view.
    if (initialActiveSection) {
        initialActiveSection.setAttribute('aria-hidden', 'false');
    }
    const initialSectionChangeEvent = new CustomEvent('sectionChange', {
        detail: {isHomeActive: initialHomeActive}
    });
    window.dispatchEvent(initialSectionChangeEvent);


    // --- Request Panel Logic ---
    function openPanel() {
        if (!requestPanel || !panelOverlay) return;
        elementToFocusOnPanelClose = document.activeElement;
        requestPanel.setAttribute('aria-hidden', 'false');
        panelOverlay.setAttribute('aria-hidden', 'false');
        requestPanel.classList.add('open');
        panelOverlay.classList.add('active');
        body.style.overflow = 'hidden';

        const firstFocusable = requestPanel.querySelector('a[href], button:not([disabled]), textarea, input, select') || closeRequestPanelBtn;
        if (firstFocusable) firstFocusable.focus();
        requestPanel.addEventListener('keydown', trapFocusInPanel);
    }

    function closePanel() {
        if (!requestPanel || !panelOverlay) return;
        requestPanel.classList.remove('open');
        panelOverlay.classList.remove('active');
        requestPanel.setAttribute('aria-hidden', 'true');
        panelOverlay.setAttribute('aria-hidden', 'true');
        body.style.overflow = '';
        requestPanel.removeEventListener('keydown', trapFocusInPanel);
        if (elementToFocusOnPanelClose?.focus) elementToFocusOnPanelClose.focus();
        elementToFocusOnPanelClose = null;
    }

    function trapFocusInPanel(e) { // Focus Trap
        if (e.key !== 'Tab' || !requestPanel) return;
        const focusableElementsString = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';
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
        if (e.key === 'Escape' && requestPanel?.classList.contains('open')) closePanel();
    });


    // --- Audio Control Logic ---
    function showAudioError(message) {
        if (audioErrorMessage) {
            audioErrorMessage.textContent = message;
            audioErrorMessage.classList.add('visible');
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
        // Autoplay is unreliable, often blocked. Best effort.
        if (bgMusic && bgMusic.paused) {
            setTimeout(() => { // Slight delay might help sometimes
                bgMusic.play().then(() => {
                    updateAudioButton(true);
                    console.log("Audio autoplay successful.");
                }).catch(err => {
                    console.warn('Audio autoplay failed (likely browser policy):', err.name);
                    updateAudioButton(false);
                    // Don't show error on initial failed autoplay
                });
            }, 100);
        } else if (bgMusic && !bgMusic.paused) {
            updateAudioButton(true); // Sync button if already playing
        }
    }

    function toggleAudio() {
        if (!bgMusic) return;
        if (audioErrorMessage) audioErrorMessage.classList.remove('visible');

        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                updateAudioButton(true);
            }).catch(err => {
                console.error('Audio play failed on toggle:', err);
                updateAudioButton(false);
                let message = 'Unable to play audio. Please check browser settings.';
                if (err.name === 'NotAllowedError') {
                    message = 'Audio playback requires interaction (like clicking) first.';
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
        bgMusic.addEventListener('play', () => updateAudioButton(true));
        bgMusic.addEventListener('pause', () => updateAudioButton(false));
        bgMusic.addEventListener('ended', () => updateAudioButton(false)); // Reset on end
        updateAudioButton(!bgMusic.paused); // Initial state sync
    }


    // --- Project Modal Logic ---
    function openProjectModal(projectId) {
        const details = projectDetails[projectId];
        // Check if details exist for the given projectId
        if (!details) {
            console.error(`Project details not found for ID: ${projectId}. Check projects.json.`);
            // Optionally show a user-friendly error message here
            return;
        }
        if (!projectModal) return;

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
        if (descEl) descEl.innerHTML = details.description; // Allow basic HTML if needed
        if (techEl) techEl.textContent = details.tech;
        if (chalEl) chalEl.textContent = details.challenges;

        // Handle image display and alt text
        if (imgEl) {
            if (details.image) {
                imgEl.src = details.image;
                imgEl.alt = details.title ? `Screenshot of the ${details.title} project.` : 'Project screenshot.'; // Improved Alt Text
                imgEl.classList.add('visible'); // Use CSS class to show
            } else {
                imgEl.classList.remove('visible'); // Use CSS class to hide
                imgEl.alt = ''; // Clear alt text
            }
        }

        // Handle links visibility
        [liveLinkEl, repoLinkEl].forEach(linkEl => {
            if (linkEl) {
                const linkType = linkEl.id.includes('live') ? 'liveLink' : 'repoLink';
                if (details[linkType]) {
                    linkEl.href = details[linkType];
                    linkEl.style.display = 'inline-block'; // Show link
                } else {
                    linkEl.style.display = 'none'; // Hide link
                }
            }
        });

        // Open the modal
        projectModal.setAttribute('aria-hidden', 'false');
        projectModal.classList.add('open');
        body.style.overflow = 'hidden'; // Prevent background scroll

        // Focus management
        const focusTarget = projectModal.querySelector('.modal-close-btn') || projectModal.querySelector('a[href], button');
        if (focusTarget) focusTarget.focus();
        projectModal.addEventListener('keydown', trapFocusInModal);
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        body.style.overflow = ''; // Restore scroll
        projectModal.removeEventListener('keydown', trapFocusInModal);

        if (elementToFocusOnModalClose?.focus) elementToFocusOnModalClose.focus();
        elementToFocusOnModalClose = null;
    }

    function trapFocusInModal(e) { // Focus Trap
        if (e.key !== 'Tab' || !projectModal) return;
        const modalContent = projectModal.querySelector('.modal-content');
        if (!modalContent) return;
        const focusableElementsString = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';
        const focusableElements = Array.from(modalContent.querySelectorAll(focusableElementsString));
        const closeBtn = projectModal.querySelector('.modal-close-btn');
        if (closeBtn && !focusableElements.includes(closeBtn)) {
            focusableElements.unshift(closeBtn); // Ensure close button is trappable
        }
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

    // Setup project card listeners (Function called after data loaded)
    function setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card[data-modal-target]');
        let cardCount = 0;
        projectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            if (!projectId) {
                console.warn("Project card missing data-project-id attribute:", card);
                return; // Skip cards without an ID
            }

            // Ensure the project data for this card actually exists
            if (!projectDetails[projectId]) {
                console.warn(`No project data found for ID: ${projectId}. Card interactions disabled for:`, card);
                card.style.cursor = 'default'; // Indicate non-interactive
                card.removeAttribute('tabindex'); // Remove from tab order
                card.removeAttribute('role');
                return; // Skip adding listeners
            }

            cardCount++;
            card.addEventListener('click', () => {
                openProjectModal(projectId);
            });

            // Keyboard accessibility (Enter/Space)
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Prevent space bar scroll
                    openProjectModal(projectId);
                }
            });
        });
        console.log(`Setup listeners for ${cardCount} project cards with valid data.`);
    }


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