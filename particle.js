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
  }
  
  function initParticles() {
    particles = [];
    let numberOfParticles = Math.floor(canvas.width * canvas.height / 1000);
    for (let i = 0; i < numberOfParticles; i++) {
      let particle = new Particle(Math.random() * canvas.width, Math.random() * canvas.height);
      particles.push(particle);
    }
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.draw();
      // Calculate movement based on noise
      let pos = p.pos.div(12); // Adjust based on your needs
      let v = field[Math.floor(pos.x)][Math.floor(pos.y)];
      p.move(v);
      p.wrap();
    });
    requestAnimationFrame(draw);
  }
  
  setup();
  draw();  