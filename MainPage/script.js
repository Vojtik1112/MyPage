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
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('liveClock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock();  // Initial call to display clock immediately