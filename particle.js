class Particle {
    constructor(x, y) {
      this.pos = new Vector(x, y);
      this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
      this.size = 2; // Adjust size for visibility
    }
  
    move(v) {
      this.vel.addTo(v); // Use the noise vector for movement
      this.pos.addTo(this.vel);
    }
  
    draw(ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White with some transparency
      ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
  
    wrap(canvasWidth, canvasHeight) {
      if (this.pos.x > canvasWidth) this.pos.x = 0;
      else if (this.pos.x < 0) this.pos.x = canvasWidth;
  
      if (this.pos.y > canvasHeight) this.pos.y = 0;
      else if (this.pos.y < 0) this.pos.y = canvasHeight;
    }
  }
  
  let canvas;
  let ctx;
  let particles = [];
  const particleCount = 500; // Number of particles
  
  function setup() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  
    window.addEventListener("resize", reset);
    canvas.addEventListener("click", reset);
    draw();
  }
  
  function reset() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    particles.forEach(p => {
      const nx = p.pos.x * 0.01; // Scale for noise
      const ny = p.pos.y * 0.01; // Scale for noise
      const noiseValue = noise.simplex2(nx, ny); // Get noise value
      const noiseVector = new Vector(noiseValue, noiseValue); // Create a vector from the noise value
  
      p.move(noiseVector);
      p.wrap(canvas.width, canvas.height);
      p.draw(ctx);
    });
  
    requestAnimationFrame(draw);
  }
  
  setup();
  