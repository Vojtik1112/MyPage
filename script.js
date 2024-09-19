let isFirstWallpaper = true; // Tracks which wallpaper is currently displayed

const wallpaperButton = document.querySelector('.change-wallpaper');
const body = document.body;

wallpaperButton.addEventListener('click', function() {
  if (isFirstWallpaper) {
    body.style.backgroundImage = "url('images/new-wallpaper.jpg')"; // Switch to second wallpaper
  } else {
    body.style.backgroundImage = "url('images/jupiter.jpg')"; // Switch back to first wallpaper
  }
  isFirstWallpaper = !isFirstWallpaper; // Toggle the state
});