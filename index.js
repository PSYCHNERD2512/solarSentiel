const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const shuttle = new Image();
const questions = [
  "What are the risk involved in the reconciliation process?",
  "Another question...",
  // Add more questions as needed
];
let currentQuestionIndex = 0;
shuttle.src = "./4x/shuttle.png";
const sun = new Image();
sun.src = "./4x/sun.png";
const quesBox = new Image();
quesBox.src = "./4x/questionBox.png";
const startbtn = document.getElementById("startButton");
const nextbtn = document.getElementById("nextButton");
const quesText = document.getElementById("ques");
//Game Function
function changeQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
  } else {
    currentQuestionIndex = 0; // Loop back to the first question
  }
  drawGame();
}

function startGame() {
  const canvas = document.getElementById("main");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const shuttle = new Image();
  shuttle.src = "./4x/shuttle.png";

  const startbtn = document.getElementById("startButton");
  startbtn.style.display = "none";

  const center = { x: canvas.width / 2, y: canvas.height / 2 + 20 }; // Center of the canvas

  shuttle.onload = function () {
    // Draw the sun at the center with width and height as 200px
    const sunWidth = 200;
    const sunHeight = 200;
    const sunX = center.x - sunWidth / 2;
    const sunY = center.y - sunHeight / 2;
    ctx.drawImage(sun, sunX, sunY, sunWidth, sunHeight);

    canvas.addEventListener("mousemove", function (event) {
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      const angle = Math.atan2(mouseY - center.y, mouseX - center.x); // Adjust the angle

      const distance = 130;
      const shuttleX =
        center.x + distance * Math.cos(angle) - shuttle.width / 6;
      const shuttleY =
        center.y + distance * Math.sin(angle) - shuttle.height / 6;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Draw the sun at the center with width and height as 100px
      ctx.drawImage(sun, sunX, sunY, sunWidth, sunHeight);
      ctx.drawImage(quesBox, 700, sunY + 30, sunWidth / 1.2, sunHeight / 1.2);
      ctx.fillStyle = "white";
      quesText.style.display = "block";

      ctx.save();
      ctx.translate(
        shuttleX + shuttle.width / 6,
        shuttleY + shuttle.height / 6
      );
      ctx.rotate(angle);
      ctx.drawImage(
        shuttle,
        -shuttle.width / 6,
        -shuttle.height / 6,
        shuttle.width / 3,
        shuttle.height / 3
      );
      ctx.restore();
    });
  };
}

// Call Game Function when Start button is clicked
document.getElementById("startButton").addEventListener("click", startGame);
