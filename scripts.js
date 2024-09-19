const particlesConfig = {
    fullScreen: false,
    particles: {
      number: { value: 70 },
      move: { direction: "top", speed: 2 },
      size: { value: 4 },
      opacity: { value: 0.8 },
      color: { value: "#fff" },
      glow: {
        enable: true,
        color: "#f0f0f0",
        distance: 10
      },
      lineLinked: { enable: false },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" }
      }
    }
  };
  
  document.querySelector('.middle-text').addEventListener('mouseenter', () => {
    tsParticles.load("particles-container", particlesConfig);
  });
  
  document.querySelector('.middle-text').addEventListener('mouseleave', () => {
    tsParticles.dom().forEach(container => container.destroy());
  });  