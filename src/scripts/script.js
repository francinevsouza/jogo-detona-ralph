// ======== ESTADO DO JOGO ======== //
const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
    highScore: document.querySelector("#high-score"),
    menuHighScore: document.querySelector("#menu-high-score"),
    menuScreen: document.querySelector("#menu-screen"),
    gameScreen: document.querySelector("#game-screen"),
    startButton: document.querySelector("#start-button"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: null,
    result: 0,
    currentTime: 60,
    combo: 0,
  },
  actions: {
    timerId: null,
    countDownTimerId: null,
  },
};

// ======== FUNÇÕES DE SOM ======== //
function playHitSound() {
  let audio = new Audio("./src/audios/hit.m4a");
  audio.volume = 0.2;
  audio.play();
}

function playMissSound() {
  let audio = new Audio("./src/audios/error.m4a");
  audio.volume = 0.2;
  audio.play();
}

function playGameOverSound() {
  let audio = new Audio("./src/audios/gameover.m4a");
  audio.volume = 0.9;
  audio.play();
}

// ======== MECÂNICAS ======== //
function randomSquare() {
  state.view.squares.forEach((square) => square.classList.remove("enemy"));

  if (state.values.hitPosition) {
    loseLife();
  }

  let randomNumber = Math.floor(Math.random() * 9);
  let randomSquare = state.view.squares[randomNumber];
  randomSquare.classList.add("enemy");
  state.values.hitPosition = randomSquare.id;
}

function countDown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;

  increaseDifficulty();

  if (state.values.currentTime <= 0) {
    gameOver();
  }
}

function increaseDifficulty() {
  if (state.values.currentTime % 10 === 0 && state.values.gameVelocity > 400) {
    state.values.gameVelocity -= 100;
    clearInterval(state.actions.timerId);
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  }
}

function loseLife() {
  let lives = parseInt(state.view.lives.textContent);
  lives--;
  state.view.lives.textContent = lives;
  state.values.combo = 0;
  playMissSound();

  if (lives <= 0) {
    gameOver();
  }
}

function addListenerHitBox() {
  state.view.squares.forEach((square) => {
    square.addEventListener("mousedown", () => {
      if (square.id === state.values.hitPosition) {
        state.values.result++;
        state.values.combo++;
        playHitSound();

        if (state.values.combo % 5 === 0) {
          state.values.result += 5;
        }

        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
      } else {
        state.values.combo = 0;
        playMissSound();
      }
    });
  });
}

function updateHighScore() {
  let highScore = localStorage.getItem("highScore") || 0;
  if (state.values.result > highScore) {
    localStorage.setItem("highScore", state.values.result);
    alert("🎉 Novo recorde: " + state.values.result + " pontos!");
  }
}

function gameOver() {
  clearInterval(state.actions.countDownTimerId);
  clearInterval(state.actions.timerId);
  playGameOverSound();
  updateHighScore();
  alert("⏰ Game Over! Sua pontuação foi: " + state.values.result);

  // Volta ao menu inicial
  state.view.gameScreen.classList.add("hidden");
  state.view.menuScreen.classList.remove("hidden");
  state.view.menuScreen.classList.add("fade");

  // Atualiza recorde do menu
  state.view.menuHighScore.textContent = localStorage.getItem("highScore") || 0;
}

// ======== CONTROLE DE TELA ======== //
function startGame() {
  // Oculta o menu e mostra o jogo
  state.view.menuScreen.classList.add("hidden");
  state.view.gameScreen.classList.remove("hidden");
  state.view.gameScreen.classList.add("fade");

  // Reseta valores
  state.values.result = 0;
  state.values.combo = 0;
  state.values.currentTime = 60;
  state.values.gameVelocity = 1000;

  state.view.score.textContent = 0;
  state.view.lives.textContent = 5;
  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.highScore.textContent = localStorage.getItem("highScore") || 0;

  // Inicia lógica do jogo
  state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
  state.actions.countDownTimerId = setInterval(countDown, 1000);
}

// ======== INICIALIZAÇÃO ======== //
function initialize() {
  addListenerHitBox();
  state.view.menuHighScore.textContent = localStorage.getItem("highScore") || 0;
  state.view.startButton.addEventListener("click", startGame);
}

initialize();
