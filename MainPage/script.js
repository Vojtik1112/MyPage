window.onload = function() {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 3000); // 3000 milliseconds = 3 seconds
};

// JavaScript to delay audio playback
window.addEventListener('load', function() {
    const audio = document.getElementById('myAudio');
    const delay = 3000; // Delay in milliseconds (3000ms = 3 seconds)

    setTimeout(() => {
        audio.play();
    }, delay);
});