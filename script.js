const board = document.getElementById("game-board");
const themeBtn = document.getElementById('themeBtn');
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");

const allImages = [
  "bike.jpg", "bird.jpg", "Cats.jpg", "dog.jpg",
  "headphones.jpg", "tower.jpg", "car.jpg", "flower.jpg",
  "lion.jpg", "sun.jpg", "tree.jpg", "whale.jpg"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let time = 0;
let timerInterval;
let timerStarted = false;

// --- Theme Toggle ---
function applyTheme(theme){
  const isLight = theme==='light';
  document.body.classList.toggle('light-theme',isLight);
  themeBtn.textContent = isLight ? '🌙 Dark':'☀️ Light';
}
function toggleTheme(){
  const next = document.body.classList.contains('light-theme') ? 'dark':'light';
  applyTheme(next);
  localStorage.setItem('theme',next);
}
(function initTheme(){
  const saved = localStorage.getItem('theme') || 'dark';
  applyTheme(saved);
})();
themeBtn.addEventListener('click',toggleTheme);

// --- Timer ---
function startTimer(){
  timerInterval = setInterval(()=>{
    time++;
    timerDisplay.textContent = `Time: ${time}s`;
  },1000);
}
function stopTimer(){ clearInterval(timerInterval); }

// --- Start Game ---
function startGame(level){
  board.className = "game-board "+level;
  board.innerHTML = "";

  moves = 0; time=0;
  movesDisplay.textContent=`Moves: ${moves}`;
  timerDisplay.textContent=`Time: ${time}s`;
  stopTimer(); timerStarted=false;

  let numPairs = level==='easy'?3:level==='medium'?6:12;

  const shuffledImages = [...allImages].sort(()=>0.5 - Math.random());
  const cardArray = shuffledImages.slice(0,numPairs);
  const gameCards = [...cardArray,...cardArray].sort(()=>0.5 - Math.random());

  gameCards.forEach(imageName=>{
    const card=document.createElement('div');
    card.classList.add('card');
    card.innerHTML=`
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="images/${imageName}" alt="card image"/>
        </div>
      </div>`;
    card.addEventListener('click',()=>flipCard(card));
    board.appendChild(card);
  });

  [firstCard,secondCard,lockBoard]=[null,null,false];
}

// --- Flip Card ---
function flipCard(card){
  if(lockBoard || card===firstCard) return;

  card.classList.add('flip');

  if(!timerStarted){ startTimer(); timerStarted=true; }

  if(!firstCard){ firstCard=card; return; }

  secondCard = card;
  moves++;
  movesDisplay.textContent=`Moves: ${moves}`;
  checkMatch();
}

// --- Check Match ---
function checkMatch(){
  const firstImg = firstCard.querySelector('.card-back img').src;
  const secondImg = secondCard.querySelector('.card-back img').src;

  if(firstImg===secondImg){ resetTurn(); checkWin(); }
  else {
    lockBoard=true;
    setTimeout(()=>{
      firstCard.classList.remove('flip');
      secondCard.classList.remove('flip');
      resetTurn();
    },1000);
  }
}

function resetTurn(){ [firstCard,secondCard]=[null,null]; lockBoard=false; }

// --- Check Win ---
function checkWin(){
  const allCards = document.querySelectorAll('.card');
  const flippedCards = document.querySelectorAll('.card.flip');

  if(allCards.length && allCards.length===flippedCards.length){
    stopTimer();
    document.getElementById('win-message').classList.add('show');
  }
}

// --- Restart Game ---
function restartGame(){
  document.getElementById('win-message').classList.remove('show');
  startGame('easy');
}
