const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const beamOffset = 20;
var prevasteroid = -1;
const adjustedBeamWidth = 3;
const adjustedBeamHeight = 15;
const shuttle = new Image();
shuttle.src = "./4x/shuttle.png";
correctOptions = ["optionA", "optionC"];
const sun = new Image();
sun.src = "./4x/sun.png";
console.log(sun.height);
const blueBox = new Image();
blueBox.src = "./4x/blueBox.png";
let gameOverFlag = false;
let partialCorrectFlag = false;
console.log(sun.width);
const beamImg = new Image();
beamImg.src = "./4x/beam.png";
const ques = document.getElementById("ques");

const quesBox = new Image();
quesBox.src = "./4x/questionBox.png";

options = ["optionA", "optionB", "optionC", "optionD", "optionE"];
const asteroidImage = new Image();
asteroidImage.src = "./4x/aes1.png";

const startbtn = document.getElementById("startButton");
const retrybtn = document.getElementById("retry");
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
const correct = document.getElementById("correct");
const incorrect = document.getElementById("incorrect");
const partial = document.getElementById("partial");
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
function checkCollisions() {
  console.log(asteroids.length);

  for (let j = asteroids.length - 1; j >= 0; j--) {
    if (
      asteroids[j].x < -asteroids[j].width - 10 ||
      asteroids[j].x > canvas.width + asteroids[j].width + 10
    ) {
      asteroids.splice(j, 1); // Remove the asteroid from the array
    }
  }
  if (asteroids.length == 0 && prevasteroid == 1 && correctCollisions != 0) {
    showPartialCorrectWindow();
  }
  if (asteroids.length == 0 && prevasteroid == 1 && correctCollisions == 0) {
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
          correctCollisions++;

          asteroids.splice(i, 1);
          beams.splice(j, 1);
          correctOptions = correctOptions.filter(
            (opt) => opt !== asteroid.option
          );

          if (correctOptions.length === 0) {
            gameWon();
            return;
          }
        } else {
          gameOver();
        }
      }
    }
    prevasteroid = asteroids.length;
  }
}

function showPartialCorrectWindow() {
  gameOverFlag = true;
  partial.style.display = "block";
  retrybtn.style.display = "block";
  console.log("partial");
}

function drawAsteroids() {
  for (const asteroid of asteroids) {
    ctx.drawImage(
      asteroidImage,
      asteroid.x,
      asteroid.y,
      asteroid.width,
      asteroid.height
    );
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(asteroid.option, asteroid.x, asteroid.y);
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
  ques.style.display = "block";
  sun.height = sun.height / 4;
  sun.width = sun.width / 4;
  beamImg.height = 0.15 * beamImg.height;
  beamImg.width = 0.15 * beamImg.width;
  startbtn.style.display = "none";
  canvas.addEventListener("click", shootBeam);

  canvas.addEventListener("mousemove", function (event) {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
  });
  setInterval(generateAsteroid, 3000);
  gameLoop();
}

startbtn.addEventListener("click", startGame);
function gameOver() {
  gameOverFlag = true;
  retrybtn.style.display = "block";
  incorrect.style.display = "block";
}

function gameWon() {
  gameOverFlag = true;
  retrybtn.style.display = "block";
  correct.style.display = "block";
}

function retryGame() {
  location.reload();
}
