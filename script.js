// script.js
document.addEventListener("DOMContentLoaded", () => {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingScreen = document.getElementById('loading-screen');
    const mobileBlockScreen = document.getElementById('mobile-block-screen');
    const content = document.querySelector('.video-container');

    // Detect mobile devices
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
        // Show the mobile block screen and hide other content
        mobileBlockScreen.style.display = 'flex';
        content.style.display = 'none';
        loadingScreen.style.display = 'none';
    } else {
        mobileBlockScreen.style.display = 'none'; // Hide mobile block screen for non-mobile users
    }

    // Simulate loading progress for non-mobile users
    let progress = 0;

    const interval = setInterval(() => {
        progress += 10; // Increase progress by 10% every 300ms
        loadingBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval); // Stop the interval when progress reaches 100%

            // Hide the loading screen and show the content
            loadingScreen.style.display = 'none';
            content.style.display = 'flex'; // Use flex to display the content properly
        }
    }, 300); // Adjust the interval time for faster/slower loading
});