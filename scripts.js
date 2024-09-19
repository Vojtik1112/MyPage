const particlesConfig = {
    fullScreen: false,
    particles: {
      number: { value: 50 },
      move: { direction: "top", speed: 1.5 },
      size: { value: 3 },
      opacity: { value: 0.7 }
    }
  };
  
  document.querySelector('.middle-text').addEventListener('mouseenter', () => {
    tsParticles.load("particles-container", particlesConfig);
  });
  
  document.querySelector('.middle-text').addEventListener('mouseleave', () => {
    tsParticles.dom().forEach(container => container.destroy());
  });  