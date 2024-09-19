const wallpaperButton = document.querySelector('.change-wallpaper');

wallpaperButton.addEventListener('click', function() {
  document.body.style.backgroundImage = "url('images/new-wallpaper.jpg')"; // Local file path
});