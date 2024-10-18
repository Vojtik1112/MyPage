document.addEventListener("DOMContentLoaded", function() {
    const overlay = document.getElementById('overlay');
    const audio = document.getElementById('myAudio');
    const muteButton = document.getElementById('muteButton');
    const clockElement = document.getElementById('clock');
    let isMuted = false;

    // Hide overlay after a delay
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2000); // Adjust delay if needed

    // Mute button functionality
    muteButton.addEventListener('click', function() {
        isMuted = !isMuted; // Toggle mute state
        audio.muted = isMuted; // Set audio muted state
        muteButton.textContent = isMuted ? "Unmute" : "Mute"; // Change button text
    });

    // Start audio playback only after the mute button is clicked
    muteButton.addEventListener('click', function() {
        if (!audio.paused) {
            return; // If audio is already playing, do nothing
        }
        audio.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    });

    // Update clock
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateClock(); // Display the time immediately
    setInterval(updateClock, 1000); // Update every second
});