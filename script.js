let isFirstWallpaper = true; // Tracks which wallpaper is currently displayed

const wallpaperButton = document.querySelector('.change-wallpaper');
const container = document.querySelector('.container'); // Target the container for background change

wallpaperButton.addEventListener('click', function() {
  if (isFirstWallpaper) {
    container.style.backgroundImage = "url('images/new-wallpaper.jpg')"; // Switch to second wallpaper
  } else {
    container.style.backgroundImage = "url('images/jupiter.jpg')"; // Switch back to first wallpaper
  }
  isFirstWallpaper = !isFirstWallpaper; // Toggle the state
});