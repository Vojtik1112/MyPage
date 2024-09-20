class Particle {
    constructor(x, y) {
      this.pos = new Vector(x, y);
      this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
      this.acc = new Vector(0, 0);
      this.size = 1;
    }
  
    move(acc) {
      if (acc) {
        this.acc.addTo(acc);
      }
      this.vel.addTo(this.acc);
      this.pos.addTo(this.vel);
      if (this.vel.getLength() > 1) {
        this.vel.setLength(1);
      }
      this.acc.setLength(0);
    }
  
    draw() {
      ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
    }
  
    wrap() {
      if (this.pos.x > w) {
        this.pos.x = 0;
      } else if (this.pos.x < -this.size) {
        this.pos.x = w - 1;
      }
      if (this.pos.y > h) {
        this.pos.y = 0;
      } else if (this.pos.y < -this.size) {
        this.pos.y = h - 1;
      }
    }
  }
  
  let canvas;
  let ctx;
  let particles;
  let field; // Declare the field variable
  
  function setup() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");
    reset();
    window.addEventListener("resize", reset);
    canvas.addEventListener("click", reset);
  }
  
  function reset() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    createField(); // Call the function to create the field
  }
  
  function initParticles() {
    particles = [];
    let numberOfParticles = Math.floor(canvas.width * canvas.height / 1000);
    for (let i = 0; i < numberOfParticles; i++) {
      let particle = new Particle(Math.random() * canvas.width, Math.random() * canvas.height);
      particles.push(particle);
    }
  }
  
  function createField() {
    const noiseScale = 0.1; // Adjust this value for noise frequency
    const width = Math.floor(canvas.width / 10);
    const height = Math.floor(canvas.height / 10);
    field = new Array(width);
    
    for (let x = 0; x < width; x++) {
      field[x] = new Array(height);
      for (let y = 0; y < height; y++) {
        const nx = x * noiseScale;
        const ny = y * noiseScale;
        const noiseValue = noise.simplex2(nx, ny); // Use your noise function
        field[x][y] = new Vector(noiseValue, noiseValue); // Store noise values as vectors
      }
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.draw();
      let pos = p.pos.div(12); // Adjust based on your needs
      let v = field[Math.floor(pos.x / 10)][Math.floor(pos.y / 10)]; // Adjust indexing based on field size
      p.move(v);
      p.wrap();
    });
    requestAnimationFrame(draw);
  }
  
  setup();
  draw();
  