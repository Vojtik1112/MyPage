const starsContainer = document.getElementById('randomChars'); // Ensure you have a container with this ID
const numStars = 100; // Adjust the number of stars if needed

function createStar() {
    const star = document.createElement('div');
    star.style.position = 'absolute';
    star.style.background = 'white';
    star.style.borderRadius = '50%';
    star.style.opacity = '0.8';
    const size = Math.random() * 5 + 5; // Random size between 5px and 10px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    return star;
}

function randomizePosition(element) {
    const x = Math.random() * window.innerWidth;
    element.style.left = `${x}px`;
    element.style.top = `-20px`; // Start just above the viewport
}

function generateStars() {
    for (let i = 0; i < numStars; i++) {
        const star = createStar();
        randomizePosition(star);
        starsContainer.appendChild(star);

        // Animate falling star
        star.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`; // Random fall duration between 2s and 5s

        // Remove the star after it falls
        star.addEventListener('animationend', () => {
            starsContainer.removeChild(star);
        });
    }
}

setInterval(generateStars, 1000); // Create new stars every second

generateStars(); // Initial call to generate stars

function createButton() {
    const button = document.createElement('button');
    button.id = 'randomButton';
    button.textContent = 'PSSST';
    button.onclick = function() {
        playSoundAndShowImage();
        moveButton(button);
    };
    document.body.appendChild(button);
    moveButton(button);
}

function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
}

function playSoundAndShowImage() {
    // Play the click sound
    const clickSound = document.getElementById('click-sound');
    clickSound.play();

    // Show the image
    const popupImage = document.getElementById('popup-image');
    popupImage.style.display = 'block';

    setTimeout(() => {
        popupImage.style.display = 'none';
    }, 100);
}

window.onload = createButton;

// Ensure background music is playing
window.addEventListener('load', () => {
    const backgroundMusic = document.getElementById('background-music');
    backgroundMusic.play();
});