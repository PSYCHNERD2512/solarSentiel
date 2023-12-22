var parentVar = 'Points';
var player;
initScore = 0;

const canvas = document.getElementById('main');
const next = document.getElementById('next');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const beamOffset = 20;
var prevasteroid = -1;
const adjustedBeamWidth = 3;
const adjustedBeamHeight = 15;
const shuttle = new Image();
shuttle.src = './4x/shuttle.png';
correctOptions = [
  'Kickbacks\n& Fraudulent\nActivities',
  'Mismanagement &\nLack of Controls',
  'Incorrect\nMatching',
  'Incorrect\nInvestigation &\nCommentary',
];
const sun = new Image();
sun.src = './4x/sun.png';
console.log(sun.height);
const blueBox = new Image();
blueBox.src = './4x/blueBox.png';
let gameOverFlag = false;
console.log(sun.width);
const beamImg = new Image();
beamImg.src = './4x/beam.png';
const ques = document.getElementById('ques');
const score = document.getElementById('score');
var scoreVal = 0;
var corr_audio = new Audio('./audio/correct.mp3');
var wrong_audio = new Audio('./audio/wrong.mp3');
const quesBox = new Image();
quesBox.src = './4x/questionBox.png';

options = [
  'Kickbacks\n& Fraudulent\nActivities',
  'Unrelated Administrative\nProcedures',
  'Mismanagement &\nLack of Controls',
  'Data Entry\nAccuracy',
  'Incorrect\nMatching',
  'Incorrect\nInvestigation &\nCommentary',
];
const asteroidImage = new Image();
asteroidImage.src = './4x/aes1.png';
boomImages = [];
for (let i = 1; i <= 10; i++) {
  explosionImage = new Image();

  explosionImage.src = './4x/boom' + i + '.png';
  explosionImage.onload = function () {
    console.log('./4x/boom' + i + '.png');
  };

  boomImages.push(explosionImage);
  boomImages[i - 1].onload = function () {
    console.log(boomImages[i - 1]);
  };
}
const startbtn = document.getElementById('startButton');
const retrybtn = document.getElementById('retry');
const center = { x: canvas.width / 2, y: canvas.height / 2 };
console.log(center.x + center.y);
const asteroidWidth = 50;
const asteroidHeight = 50;
const maxAsteroidSpeed = 2;
const minAsteroidSpeed = 1;
const beamSpeed = 5;
const beamWidth = 5;
const beamHeight = 20;

const asteroids = [];
const beams = [];
const correct = document.getElementById('correct');
const incorrect = document.getElementById('incorrect');
const partial = document.getElementById('partial');
let mouseX = center.x;
let mouseY = center.y;
let i = 0;
function getRandomMinusOneOrOne() {
  return Math.random() < 0.5 ? -1 : 1;
}
function drawBlueBox() {
  ctx.drawImage(blueBox, center.x - 100, center.y - 100, 200, 200);
}

function generateAsteroid() {
  if (i >= options.length) return;

  const asteroidY =
    getRandomMinusOneOrOne() * Math.random() * (sun.height / 2) +
    canvas.height / 2;
  let dir = getRandomMinusOneOrOne();
  const asteroidSpeed =
    Math.random() * (maxAsteroidSpeed - minAsteroidSpeed) + minAsteroidSpeed;
  const newAsteroid = {
    Image: asteroidImage,
    x: (canvas.width / 2) * (1 + dir) + dir * asteroidWidth,
    y: asteroidY,
    speed: asteroidSpeed,
    width: asteroidWidth,
    height: asteroidHeight,
    option: options[i],
    dir: dir,
  };
  asteroids.push(newAsteroid);
  i++;
}

function shootBeam(event) {
  const mouseX = event.clientX - canvas.getBoundingClientRect().left;
  const mouseY = event.clientY - canvas.getBoundingClientRect().top;

  const angle = Math.atan2(mouseY - center.y, mouseX - center.x);

  const beam = {
    x: center.x + 100 * Math.cos(angle),

    y: center.y + 100 * Math.sin(angle),

    angle: angle,
    speed: beamSpeed,
    width: beamImg.width,
    height: beamImg.height,
  };

  beams.push(beam);
}

function updateAsteroids() {
  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];
    if (asteroid.dir == 1) asteroid.x -= asteroid.speed;
    else asteroid.x += asteroid.speed;

    if (asteroid.x + asteroid.width < 0) {
      asteroids.splice(i, 1);
    }
  }
}

function updateBeams() {
  for (let i = beams.length - 1; i >= 0; i--) {
    const beam = beams[i];
    beam.x += beam.speed * Math.cos(beam.angle);
    beam.y += beam.speed * Math.sin(beam.angle);

    if (beam.x > canvas.width) {
      beams.splice(i, 1);
    }
  }
}
let correctCollisions = 0;
let wrongCollision = 0;
function checkCollisions() {
  for (let j = asteroids.length - 1; j >= 0; j--) {
    if (
      asteroids[j].x < -asteroids[j].width - 10 ||
      asteroids[j].x > canvas.width + asteroids[j].width + 10
    ) {
      asteroids.splice(j, 1);
    }
  }
  if (
    asteroids.length == 0 &&
    correctCollisions != 0 &&
    wrongCollision == 0 &&
    correctOptions.length != correctCollisions
  ) {
    showPartialCorrectWindow();
  }
  if (correctOptions.length == correctCollisions && wrongCollision == 0) {
    gameWon();
  }
  console.log(asteroids.length);
  console.log(correctCollisions);
  console.log(wrongCollision);
  console.log(prevasteroid);
  if (asteroids.length == 0 && wrongCollision != 0 && prevasteroid == 1) {
    gameOver();
  }

  for (let i = asteroids.length - 1; i >= 0; i--) {
    const asteroid = asteroids[i];

    for (let j = beams.length - 1; j >= 0; j--) {
      const beam = beams[j];

      if (
        beam.x < asteroid.x + asteroid.width &&
        beam.x + beam.width > asteroid.x &&
        beam.y < asteroid.y + asteroid.height &&
        beam.y + beam.height > asteroid.y
      ) {
        if (correctOptions.includes(asteroid.option)) {
          corr_audio.volume = 0.1;
          corr_audio.play();
          correctCollisions++;

          explodeAsteroid(asteroid, i);

          beams.splice(j, 1);
        } else {
          asteroids.splice(i, 1);
          wrong_audio.volume = 0.05;
          wrong_audio.play();
          wrongCollision++;
        }
      }
    }

    prevasteroid = asteroids.length;
  }
}

function showPartialCorrectWindow() {
  gameOverFlag = true;
  partial.style.display = 'block';
  retrybtn.style.display = 'block';
  console.log('partial');
}
let startflag = 0;
function drawAsteroids() {
  startflag = 1;
  for (const asteroid of asteroids) {
    ctx.drawImage(
      asteroid.Image,
      asteroid.x,
      asteroid.y,
      asteroid.width,
      asteroid.height
    );
    const lines = asteroid.option.split('\n');
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';

    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], asteroid.x, asteroid.y + i * 15 - 30); // Adjust the spacing (15) as needed
    }
  }
}

function drawBeams() {
  for (const beam of beams) {
    ctx.save();
    ctx.translate(beam.x, beam.y);
    ctx.rotate(beam.angle);
    ctx.drawImage(
      beamImg,
      -beam.width / 2,
      -beam.height / 2,
      beam.width,
      beam.height
    );
    ctx.restore();
  }
}

function drawShuttle() {
  const distanceX = 100;
  ctx.save();

  const angle = Math.atan2(mouseY - center.y, mouseX - center.x);
  ctx.translate(
    center.x + distanceX * Math.cos(angle),
    center.y + distanceX * Math.sin(angle)
  );
  ctx.rotate(angle);

  const shuttleWidth = 50;
  const shuttleHeight = 30;

  ctx.drawImage(
    shuttle,
    -shuttleWidth / 2,
    -shuttleHeight / 2,
    shuttleWidth,
    shuttleHeight
  );

  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    sun,
    center.x - sun.width / 2,
    center.y - sun.height / 2,
    sun.width,
    sun.height
  );
  ctx.drawImage(quesBox, center.x + 300, center.y - 50, 150, 150);
  drawAsteroids();
  drawBeams();
  drawShuttle();
}

function gameLoop() {
  scoreVal = 5 * correctCollisions + -1 * wrongCollision;
  score.innerHTML = 'Score:\n' + scoreVal;
  if (gameOverFlag) {
    drawBlueBox();
    return;
  }

  updateAsteroids();
  updateBeams();

  checkCollisions();
  draw();

  requestAnimationFrame(gameLoop);
}

function startGame() {
  if (window.parent && window.parent.GetPlayer) {
    player = window.parent.GetPlayer();
    if (player) {
      console.log('Get Var ', player.GetVar);
      console.log('Get Var score', player.GetVar(parentVar));
      initScore = player.GetVar(parentVar);
    }
  }

  score.style.display = 'block';

  ques.style.display = 'block';
  sun.height = sun.height / 4;
  sun.width = sun.width / 4;
  beamImg.height = 0.15 * beamImg.height;
  beamImg.width = 0.15 * beamImg.width;
  startbtn.style.display = 'none';
  canvas.addEventListener('click', shootBeam);

  canvas.addEventListener('mousemove', function (event) {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
  });
  setInterval(generateAsteroid, 2000);
  gameLoop();
}

startbtn.addEventListener('click', startGame);
function gameOver() {
  if (player) {
    //score = player.getVar(parentVar);
    player.SetVar(parentVar, initScore + scoreVal);
  }

  gameOverFlag = true;
  retrybtn.style.display = 'block';
  incorrect.style.display = 'block';
}

function gameWon() {
  next.style.display = 'block';
  gameOverFlag = true;
  retrybtn.style.display = 'block';
  correct.style.display = 'block';
}

function retryGame() {
  location.reload();
}
function explodeAsteroid(asteroid, i) {
  let explosionIndex = 0;

  function explode() {
    asteroid.Image = boomImages[explosionIndex];

    if (explosionIndex < boomImages.length - 1) {
      explosionIndex++;
      setTimeout(explode, 50);
    } else {
      asteroids.splice(i, 1);
    }
  }

  explode();
}
