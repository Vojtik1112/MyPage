const wallpaperButton = document.querySelector('.change-wallpaper');

wallpaperButton.addEventListener('click', function() {
  document.body.style.backgroundImage = "url('new-wallpaper.jpg')"; // Replace with the new wallpaper path
});