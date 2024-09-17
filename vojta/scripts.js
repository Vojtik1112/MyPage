const charsContainer = document.getElementById('randomChars');
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%';
const numChars = 100;

function createRandomCharacter() {
    const char = document.createElement('div');
    char.style.position = 'absolute';
    char.style.color = '#0F0';
    char.style.fontSize = '20px';
    char.style.fontFamily = 'monospace';
    char.textContent = characters[Math.floor(Math.random() * characters.length)];
    return char;
}

function randomizePosition(element) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
}

function generateRandomCharacters() {
    for (let i = 0; i < numChars; i++) {
        const char = createRandomCharacter();
        randomizePosition(char);
        charsContainer.appendChild(char);

        setTimeout(() => {
            charsContainer.removeChild(char);
        }, 2000);
    }
}

setInterval(generateRandomCharacters, 1000);

generateRandomCharacters();

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