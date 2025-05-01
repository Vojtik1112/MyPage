// script.js
// (Handles preloader, navigation, slide-out panel)

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader');
    const pageWrapper = document.getElementById('page-wrapper');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const openRequestPanelBtn = document.getElementById('open-request-panel');
    const closeRequestPanelBtn = document.getElementById('close-request-panel');
    const requestPanel = document.getElementById('request-panel');
    const panelOverlay = document.getElementById('panel-overlay');

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
        if (preloader) { // Check if preloader still exists
            preloader.classList.add('hidden');
        }
        if (pageWrapper) { // Check if pageWrapper exists
            pageWrapper.classList.add('visible');
        }
        // Clean up preloader from DOM after transition
        setTimeout(() => {
            if (preloader && preloader.parentNode) {
                preloader.parentNode.removeChild(preloader);
            }
        }, 800); // Match preloader transition duration
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
        document.body.style.overflow = '';
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

});
