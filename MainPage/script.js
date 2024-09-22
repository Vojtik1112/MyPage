window.onload = function() {
    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 2000); // 2000 milliseconds = 2 seconds
};

// JavaScript to delay audio playback
window.addEventListener('load', function() {
    const audio = document.getElementById('myAudio');
    const delay = 2000; // Delay in milliseconds (2000ms = 2 seconds)

    setTimeout(() => {
        audio.play();
    }, delay);
});