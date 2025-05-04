// script.js
// (Handles preloader, navigation, panel, theme, audio, modal, data loading, animations)

document.addEventListener('DOMContentLoaded', async () => {
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
    const modalCloseBtns = document.querySelectorAll('[data-modal-close]');

    // --- Global State ---
    let projectDetails = {};
    let elementToFocusOnPanelClose = null;
    let elementToFocusOnModalClose = null;
    const lightModeIcon = '☀️';
    const darkModeIcon = '🌙';
    // Updated colors to match new CSS variables
    const lightTesseractColor = 0x34495e;
    const darkTesseractColor = 0xbdc3c7;

    // --- Check for essential elements ---
    if (!pageWrapper || !requestPanel || !panelOverlay || !projectModal) {
        console.error("One or more essential layout elements missing.");
    }
    if (!themeToggleBtn || !themeIconSpan) {
        console.warn("Theme toggle button or icon span not found.");
    }
    if (!bgMusic || !audioToggleBtn || !playIcon || !pauseIcon) {
        console.warn("Audio elements missing. Audio controls disabled.");
        if (audioToggleBtn) audioToggleBtn.style.display = 'none';
    }

    // --- Project Data Loading ---
    async function loadProjectData() {
        try {
            const response = await fetch('assets/projects/projects.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - Could not fetch project data.`);
            }
            projectDetails = await response.json();
            console.log('Project data loaded successfully.');
            setupProjectCards();
        } catch (error) {
            console.error("Failed to load or parse project data:", error);
        }
    }

    // --- Preloader Logic ---
    const letters = {
        c1: document.getElementById('letter-c1'),
        b: document.getElementById('letter-b')
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
            attemptAudioAutoplay();

            setTimeout(() => {
                preloader.remove();
            }, 800);
        }, 1800);
    } else {
        if (pageWrapper) pageWrapper.classList.add('visible');
        attemptAudioAutoplay();
    }

    // --- Load Project Data ---
    await loadProjectData();

    // --- Theme Toggle Logic ---
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        body.classList.toggle('dark-mode', isDark);
        if (themeIconSpan) themeIconSpan.textContent = isDark ? lightModeIcon : darkModeIcon;
        const tesseractColor = isDark ? darkTesseractColor : lightTesseractColor;
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: {theme: theme, color: tesseractColor}
        });
        window.dispatchEvent(themeChangeEvent);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    try {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (!localStorage.getItem('theme')) {
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

            if (targetSection && !targetSection.classList.contains('active')) { // Only switch if not already active
                let isHomeSectionTargeted = targetId === 'home-section';

                // Deactivate all first
                contentSections.forEach(s => {
                    s.classList.remove('active');
                    s.setAttribute('aria-hidden', 'true');
                });

                // Activate target section
                targetSection.classList.add('active');
                targetSection.setAttribute('aria-hidden', 'false');


                // Update nav link states
                navLinks.forEach(l => {
                    const isCurrent = l === link;
                    l.classList.toggle('active', isCurrent);
                    if (isCurrent) {
                        l.setAttribute('aria-current', 'page');
                    } else {
                        l.removeAttribute('aria-current');
                    }
                });

                // Dispatch event for Tesseract
                const sectionChangeEvent = new CustomEvent('sectionChange', {
                    detail: {isHomeActive: isHomeSectionTargeted}
                });
                window.dispatchEvent(sectionChangeEvent);

                // Trigger animations for newly visible section
                triggerSectionAnimations(targetSection);

            } else if (!targetSection) {
                console.warn(`Navigation target section not found: #${targetId}`);
            }
        });
    });

    // Initial setup for aria-hidden and Tesseract state
    const initialActiveSection = document.querySelector('.content-section.active');
    contentSections.forEach(s => {
        const isActive = s === initialActiveSection;
        s.setAttribute('aria-hidden', String(!isActive));
    });
    const initialHomeActive = initialActiveSection && initialActiveSection.id === 'home-section';
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

        const firstFocusable = requestPanel.querySelector('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])') || closeRequestPanelBtn;
        if (firstFocusable) setTimeout(() => firstFocusable.focus(), 50); // Delay focus slightly for transition
        requestPanel.addEventListener('keydown', trapFocusInPanel);
    }

    function closePanel() {
        if (!requestPanel || !panelOverlay) return;
        requestPanel.classList.remove('open');
        panelOverlay.classList.remove('active');
        // Wait for transition before setting aria-hidden
        setTimeout(() => {
            requestPanel.setAttribute('aria-hidden', 'true');
            panelOverlay.setAttribute('aria-hidden', 'true');
            if (elementToFocusOnPanelClose?.focus) elementToFocusOnPanelClose.focus();
            elementToFocusOnPanelClose = null;
        }, 400); // Match transition duration
        body.style.overflow = '';
        requestPanel.removeEventListener('keydown', trapFocusInPanel);
    }

    function trapFocusInPanel(e) {
        if (e.key !== 'Tab' || !requestPanel) return;
        const focusableElementsString = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';
        const focusableElements = Array.from(requestPanel.querySelectorAll(focusableElementsString));
        if (focusableElements.length === 0) return;
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

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
        if (bgMusic && bgMusic.paused) {
            setTimeout(() => {
                bgMusic.play().then(() => {
                    updateAudioButton(true);
                    console.log("Audio autoplay successful.");
                }).catch(err => {
                    console.warn('Audio autoplay failed:', err.name);
                    updateAudioButton(false);
                });
            }, 100);
        } else if (bgMusic && !bgMusic.paused) {
            updateAudioButton(true);
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
                let message = 'Unable to play audio. Check browser settings.';
                if (err.name === 'NotAllowedError') {
                    message = 'Audio playback requires user interaction first.';
                }
                showAudioError(message);
            });
        } else {
            bgMusic.pause();
            updateAudioButton(false);
        }
    }

    if (audioToggleBtn && bgMusic && playIcon && pauseIcon) {
        audioToggleBtn.addEventListener('click', toggleAudio);
        bgMusic.addEventListener('play', () => updateAudioButton(true));
        bgMusic.addEventListener('pause', () => updateAudioButton(false));
        bgMusic.addEventListener('ended', () => updateAudioButton(false));
        updateAudioButton(!bgMusic.paused);
    }


    // --- Project Modal Logic ---
    function openProjectModal(projectId) {
        const details = projectDetails[projectId];
        if (!details) {
            console.error(`Project details not found for ID: ${projectId}. Check projects.json.`);
            return;
        }
        if (!projectModal) return;

        elementToFocusOnModalClose = document.activeElement;

        const titleEl = projectModal.querySelector('#project-modal-title');
        const imgEl = projectModal.querySelector('#project-modal-image');
        const descEl = projectModal.querySelector('#project-modal-description');
        const techEl = projectModal.querySelector('#project-modal-tech');
        const chalEl = projectModal.querySelector('#project-modal-challenges');
        const liveLinkEl = projectModal.querySelector('#project-modal-live-link');
        const repoLinkEl = projectModal.querySelector('#project-modal-repo-link');

        if (titleEl) titleEl.textContent = details.title;
        if (descEl) descEl.innerHTML = details.description;
        if (techEl) techEl.textContent = details.tech;
        if (chalEl) chalEl.textContent = details.challenges;

        if (imgEl) {
            if (details.image) {
                imgEl.src = details.image;
                imgEl.alt = details.title ? `Screenshot of the ${details.title} project.` : 'Project screenshot.';
                imgEl.classList.add('visible');
            } else {
                imgEl.classList.remove('visible');
                imgEl.alt = '';
            }
        }

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

        projectModal.setAttribute('aria-hidden', 'false');
        projectModal.classList.add('open');
        body.style.overflow = 'hidden';

        const focusTarget = projectModal.querySelector('.modal-close-btn') || projectModal.querySelector('a[href], button');
        if (focusTarget) setTimeout(() => focusTarget.focus(), 50); // Delay focus
        projectModal.addEventListener('keydown', trapFocusInModal);
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('open');

        setTimeout(() => {
            projectModal.setAttribute('aria-hidden', 'true');
            if (elementToFocusOnModalClose?.focus) elementToFocusOnModalClose.focus();
            elementToFocusOnModalClose = null;
        }, 300); // Match modal transition

        body.style.overflow = '';
        projectModal.removeEventListener('keydown', trapFocusInModal);
    }

    function trapFocusInModal(e) {
        if (e.key !== 'Tab' || !projectModal) return;
        const modalContent = projectModal.querySelector('.modal-content');
        if (!modalContent) return;
        const focusableElementsString = 'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';
        const focusableElements = Array.from(modalContent.querySelectorAll(focusableElementsString));
        const closeBtn = projectModal.querySelector('.modal-close-btn');
        if (closeBtn && !focusableElements.includes(closeBtn)) {
            focusableElements.unshift(closeBtn);
        }
        if (focusableElements.length === 0) return;
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
                lastFocusable.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                firstFocusable.focus();
                e.preventDefault();
            }
        }
    }

    function setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card[data-modal-target]');
        let cardCount = 0;
        projectCards.forEach(card => {
            const projectId = card.getAttribute('data-project-id');
            if (!projectId) {
                console.warn("Project card missing data-project-id attribute:", card);
                return;
            }
            if (!projectDetails[projectId]) {
                console.warn(`No project data found for ID: ${projectId}. Card interactions disabled.`);
                card.style.cursor = 'default';
                card.removeAttribute('tabindex');
                card.removeAttribute('role');
                return;
            }

            cardCount++;
            card.addEventListener('click', () => openProjectModal(projectId));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(projectId);
                }
            });
        });
        console.log(`Setup listeners for ${cardCount} project cards.`);
    }

    modalCloseBtns.forEach(button => {
        button.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal?.classList.contains('open')) {
            closeProjectModal();
        }
    });


    // --- Intersection Observer for Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries, observerRef) => {
        entries.forEach(entry => {
            // Check if the element's section is currently active before animating
            const parentSection = entry.target.closest('.content-section');
            if (entry.isIntersecting && parentSection && parentSection.classList.contains('active')) {
                entry.target.classList.add('is-visible');
                observerRef.unobserve(entry.target); // Animate only once per page load/section view
            }
        });
    }, {
        threshold: 0.1 // Adjust threshold as needed (0.1 means 10% visible)
    });

    // Observe elements initially
    animatedElements.forEach(el => observer.observe(el));

    // Function to explicitly trigger observation check for elements in a section
    // This helps ensure animations trigger correctly when navigating quickly
    function triggerSectionAnimations(sectionElement) {
        const elementsToAnimate = sectionElement.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(el => {
            // Re-observe briefly to check intersection state IF not already visible
            // This handles cases where an element might have scrolled into view
            // while the section was inactive.
            if (!el.classList.contains('is-visible')) {
                observer.unobserve(el); // Stop previous observation first
                observer.observe(el);   // Re-start observation
            }
        });
    }

    // Trigger animations for the initially active section
    if (initialActiveSection) {
        // Use setTimeout to ensure the initial layout is stable before checking
        setTimeout(() => triggerSectionAnimations(initialActiveSection), 100);
    }

}); // End of DOMContentLoaded