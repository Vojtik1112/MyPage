// Script for Timeline Scroll Animation
window.addEventListener('scroll', function() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const scrollPosition = window.scrollY + window.innerHeight;

  timelineItems.forEach(item => {
    const itemTop = item.offsetTop;
    if (scrollPosition > itemTop) {
      item.classList.add('visible');
    }
  });
});