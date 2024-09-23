window.addEventListener('load', function() {
    const overlay = document.getElementById('overlay');
    const audio = document.getElementById('myAudio');
    const delay = 2000; // Delay in milliseconds (2000ms = 2 seconds)

    // Hide overlay after a delay
    setTimeout(() => {
        overlay.style.display = 'none';
    }, delay);

    // Delay audio playback
    setTimeout(() => {
        audio.play().catch(error => {
            console.error("Audio playback failed:", error);
        });
    }, delay);
});

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Call updateClock immediately and then every second
updateClock();
setInterval(updateClock, 1000);