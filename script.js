class AudioController {
  constructor() {
    this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
    this.flipSound = new Audio('Assets/Audio/flip.wav');
    this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
    this.victorySound = new Audio('Assets/Audio/victory.wav');
    this.matchSound = new Audio('Assets/Audio/match.wav');
    this.bgMusic.volume = 0.5;
    this.bgMusic.loop = true;
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
}

class MixorMatch {
  constructor(cards, totalTime) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.flips = document.getElementById('flips');
    this.audioController = new AudioController();
  }

  startGame() {
    this.timeRemaining = this.totalTime;
    this.noOfflips = 0;
    this.cardToCheck = null;
    this.matchedCards = [];
    setTimeout(() => {
      this.audioController.startMusic();
      this.shuffleCards(this.cardsArray);
      this.countDown = this.startCountdown();
      this.busy = false;
    }, 500);
    this.timer.innerText = this.timeRemaining;
    this.flips.innerText = this.noOfflips;
  }

  startCountdown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) {
        this.gameOver();
      }
    }, 1000);
  }

  // Fisher-Yates Shuffle Algorithm.
  shuffleCards(cardsArray) {
    for (let i = cardsArray.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      cardsArray[randomIndex].style.order = i;
      cardsArray[i].style.order = randomIndex;
    }
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.audioController.flip();
      this.noOfflips++;
      this.flips.innerText = this.noOfflips;
      card.classList.add('visible');
      if (this.cardToCheck) {
        this.isCardMatched(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }

  isCardMatched(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
      this.onCardMatch(card, this.cardToCheck);
    } else {
      this.onCardMismatch(card, this.cardToCheck);
    }
  }

  onCardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.audioController.match();
    this.cardToCheck = null;
    if (this.cardsArray.length === this.matchedCards.length) {
      this.victory();
    }
  }

  onCardMismatch(card1, card2) {
    this.busy = true;
    this.cardToCheck = null;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      this.cardToCheck !== card
    );
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }

  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  gameOver() {
    clearInterval(this.countDown);
    this.audioController.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
  }

  victory() {
    clearInterval(this.countDown);
    this.audioController.victory();
    this.hideCards();
    document.getElementById('victory-text').classList.add('visible');
  }
}

const ready = () => {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let game = new MixorMatch(cards, 100);

  overlays.forEach((overlay) => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
};

if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}
