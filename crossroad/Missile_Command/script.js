const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const groundY = 500;  // y position of where the ground starts
const cityWidth = 45;  // how wide a city rect is
const cityHeight = 25;  // how tall a city rect is
const cityY = groundY - cityHeight;  // y position of the city
const siloY = groundY - 30;  // y position of the top of the silo
const missileSize = 4;  // the radius/size of a missile

const missileSpeed = 1;  // how fast a missile moves
const counterMissileSpeed = 15;  // how fast a counter-missile moves

// information about each missile
let missiles = [];
let counterMissiles = [];

// information about each explosion
let explosions = [];

// how many missiles to spawn at each interval of the level
const levels = [ [4, 4] ];
let currLevel = 0;
let currInterval = 0;

// the x/y position of all cities and if the city is currently alive
let cities = [
  { x: 140, y: cityY, alive: true },
  { x: 220, y: cityY, alive: true },
  { x: 300, y: cityY, alive: true },
  { x: 500, y: cityY, alive: true },
  { x: 580, y: cityY, alive: true },
  { x: 660, y: cityY, alive: true }
];

// the x position of each of the 3 silos
const siloPos = [ 55, canvas.width / 2, 745 ];

// the x/y position of each silo, the number of missiles left, and if it is still alive
let silos = [
  { x: siloPos[0], y: siloY, missiles: 10, alive: true },
  { x: siloPos[1], y: siloY, missiles: 10, alive: true },
  { x: siloPos[2], y: siloY, missiles: 10, alive: true }
];

// the x/y position of each missile spawn point
const missileSpawns = cities
  .concat(silos)
  .concat([{ x: 0, y: 0 }, { x: canvas.width, y: 0 }])
  .map(pos => ({ x: pos.x, y: 0 }));

// return a random integer between min (inclusive) and max (inclusive)
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// get the angle between two points
function angleBetweenPoints(source, target) {
  return Math.atan2(target.y - source.y, target.x - source.x) + Math.PI / 2;
}

// distance between two points
function distance(source, target) {
  return Math.hypot(source.x - target.x, source.y - target.y);
}

// spawn a missile
function spawnMissile() {
  const targets = cities.concat(silos);
  const randSpawn = randInt(0, missileSpawns.length - 1);
  const randTarget = randInt(0, targets.length - 1);
  const start = missileSpawns[randSpawn];
  const target = targets[randTarget];
  const angle = angleBetweenPoints(start, target);

  missiles.push({
    start,
    target,
    pos: { x: start.x, y: start.y },
    alive: true,
    dx: missileSpeed * Math.sin(angle),
    dy: missileSpeed * -Math.cos(angle)
  });
}

// game loop
let lastTime = -2000;
function loop(time) {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // spawn missiles every interval of 3 seconds
  if (time - lastTime > 3000 && currInterval < levels[currLevel].length) {
    for (let i = 0; i < levels[currLevel][currInterval]; i++) {
      spawnMissile();
    }

    currInterval++;
    lastTime = time;
  }

  // draw cities
  context.fillStyle = 'blue';
  cities.forEach(city => {
    context.fillRect(city.x - cityWidth / 2, city.y, cityWidth, cityHeight);
  });

  // draw ground and silos
  context.fillStyle = 'yellow';
  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(0, groundY);

  siloPos.forEach(x => {
    context.lineTo(x - 40, groundY);
    context.lineTo(x - 20, siloY);
    context.lineTo(x + 20, siloY);
    context.lineTo(x + 40, groundY);
  });

  context.lineTo(canvas.width, groundY);
  context.lineTo(canvas.width, canvas.height);
  context.fill();

  // draw the number of counter-missiles each silo
  context.fillStyle = 'black';
  silos.forEach(silo => {
    let missilesPerRow = 1;
    let count = 0;
    let x = silo.x;
    let y = silo.y + 5;

    for (let i = 0; i < silo.missiles; i++) {
      context.fillRect(x, y, 4, 10);
      x += 12;

      if (++count === missilesPerRow) {
        x = silo.x - 6 * count;
        missilesPerRow++;
        y += 7;
        count = 0;
      }
    }
  });

  // update and draw missiles
  context.strokeStyle = 'red';
  context.lineWidth = 2;
  context.fillStyle = 'white';
  if (Math.round(time / 2) % 2 === 0) {
    context.fillStyle = 'black';
  }

  missiles.forEach(missile => {
    missile.pos.x += missile.dx;
    missile.pos.y += missile.dy;

    explosions.forEach(explosion => {
      const dist = distance(explosion, missile.pos);
      if (dist < missileSize + explosion.size) {
        missile.alive = false;
      }
    });

    const dist = distance(missile.pos, missile.target);
    if (dist < missileSpeed) {
      missile.alive = false;
      missile.target.alive = false;
    }

    if (missile.alive) {
      context.beginPath();
      context.moveTo(missile.start.x, missile.start.y);
      context.lineTo(missile.pos.x, missile.pos.y);
      context.stroke();
      context.fillRect(missile.pos.x - missileSize / 2, missile.pos.y - missileSize / 2, missileSize, missileSize);
    } else {
      explosions.push({
        x: missile.pos.x,
        y: missile.pos.y,
        size: 2,
        dir: 1,
        alive: true
      });
    }
  });

  // update and draw counter missiles
  context.strokeStyle = 'blue';
  context.fillStyle = 'white';
  counterMissiles.forEach(missile => {
    missile.pos.x += missile.dx;
    missile.pos.y += missile.dy;

    const dist = distance(missile.pos, missile.target);
    if (dist < counterMissileSpeed) {
      missile.alive = false;
      explosions.push({
        x: missile.pos.x,
        y: missile.pos.y,
        size: 2,
        dir: 1,
        alive: true
      });
    } else {
      context.beginPath();
      context.moveTo(missile.start.x, missile.start.y);
      context.lineTo(missile.pos.x, missile.pos.y);
      context.stroke();
      context.fillRect(missile.pos.x - 2, missile.pos.y - 2, 4, 4);
    }
  });

  // update and draw explosions
  explosions.forEach(explosion => {
    explosion.size += 0.35 * explosion.dir;

    if (explosion.size > 30) {
      explosion.dir = -1;
    }

    if (explosion.size <= 0) {
      explosion.alive = false;
    } else {
      context.fillStyle = 'white';
      if (Math.round(time / 3) % 2 === 0) {
        context.fillStyle = 'blue';
      }

      context.beginPath();
      context.arc(explosion.x, explosion.y, explosion.size, 0, 2 * Math.PI);
      context.fill();
    }
  });

  // remove dead missiles, explosions, cities, and silos
  missiles = missiles.filter(missile => missile.alive);
  counterMissiles = counterMissiles.filter(missile => missile.alive);
  explosions = explosions.filter(explosion => explosion.alive);
  cities = cities.filter(city => city.alive);
  silos = silos.filter(silo => silo.alive);
}

// listen to mouse events to fire counter-missiles
canvas.addEventListener('click', e => {
  const x = e.clientX - e.target.offsetLeft;
  const y = e.clientY - e.target.offsetTop;

  let launchSilo = null;
  let siloDistance = Infinity;
  silos.forEach(silo => {
    const dist = distance({ x, y }, silo);
    if (dist < siloDistance && silo.missiles) {
      siloDistance = dist;
      launchSilo = silo;
    }
  });

  if (launchSilo) {
    const start = { x: launchSilo.x, y: launchSilo.y };
    const target = { x, y };
    const angle = angleBetweenPoints(start, target);
    launchSilo.missiles--;
    counterMissiles.push({
      start,
      target,
      pos: { x: launchSilo.x, y: launchSilo.y },
      dx: counterMissileSpeed * Math.sin(angle),
      dy: counterMissileSpeed * -Math.cos(angle),
      alive: true
    });
  }
});

// start the game
requestAnimationFrame(loop);