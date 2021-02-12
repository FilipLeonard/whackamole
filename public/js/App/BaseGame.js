import { GAME_OPTIONS, NUMBER_OF_CARDS } from './game-config.js';
import DOMHelper from './Utility/DOMHelper.js';

export default class Game {
  constructor(userOptions) {
    const { difficulty: diff } = userOptions;
    this.options = {
      ...userOptions,
      ACTIVE_TIME: GAME_OPTIONS.difficulty[diff].ACTIVE_TIME,
      NEUTRAL_TIME: GAME_OPTIONS.difficulty[diff].NEUTRAL_TIME,
      CYCLE_TIME:
        GAME_OPTIONS.difficulty[diff].ACTIVE_TIME +
        GAME_OPTIONS.difficulty[diff].NEUTRAL_TIME,
    };
    this.stats = {
      score: {
        whacksEl: document.getElementById('current-whacks'),
        multiplierEl: document.getElementById('current-multiplier'),
        consecutiveEl: document.getElementById('consecutive-tiles'),
        whacks: 0,
        multiplier: 1,
        multipliers: [2, 5],
        consecutives: 0,
        points: 0,
        increase() {
          this.increaseWhacks();
          this.increaseConsecutives();
        },
        increaseWhacks() {
          this.whacks += this.multiplier;
          this.whacksEl.textContent = this.whacks;
        },
        increaseConsecutives() {
          this.consecutives++;
          DOMHelper.addClass(`#tile${this.consecutives}`, 'active');
          if (this.consecutives === 5) this.updateMultiplier();
        },
        updateMultiplier() {
          this.multipliers.push(this.multiplier);
          this.multiplier = this.multipliers.shift();
          this.multiplierEl.textContent = this.multiplier;
          this.resetConsecutiveWhacks(500);
        },
        resetConsecutiveWhacks(afterMs = 0) {
          this.consecutives = 0;
          setTimeout(() => {
            Array.from(this.consecutiveEl.children).forEach(tile =>
              DOMHelper.removeClass(tile, 'active')
            );
          }, afterMs);
        },
        resetAll() {
          this.whacks = 0;
          this.multiplier = 1;
          this.multipliers = [2, 5];
          this.whacksEl.textContent = this.whacks;
          this.multiplierEl.textContent = this.multiplier;
          this.resetConsecutiveWhacks();
        },
      },
    };
    this.gameBoard = document.querySelector('.game__grid');
  }

  start() {
    this.setupGame();
    this.startGameLoop();
  }

  setupGame() {
    this.setupInitialPosition();
    this.gameBoard.addEventListener('click', this.whackHandler.bind(this));
  }

  whackHandler(e) {
    const whackedCard = e.target.closest('.game__square');
    if (!whackedCard || !e.isTrusted) return;
    this.whackCard(whackedCard);
  }

  setupInitialPosition() {
    this.isCurrentPositionWhacked = false;
    const initialPosition = this.getNextPosition();
    this.activateCard(initialPosition);
    this.currentPosition = initialPosition;
  }

  getNextPosition() {
    const nextPos = this.getRandomPosition();
    return nextPos === this.currentPosition ? this.getNextPosition() : nextPos;
  }

  getRandomPosition() {
    const rand = Math.random() * NUMBER_OF_CARDS;
    return Math.floor(rand) + 1;
  }

  activateCard(cardPosition) {
    this.gameBoard.querySelector(`#sq${cardPosition}`).classList.add('active');
  }

  whackCard(card) {
    const whackedOnTime = card.classList.contains('active');
    if (whackedOnTime) {
      this.animateCard(card, 'wiggle');
      this.registerValidWhack(card);
    } else {
      this.animateCard(card, 'shake');
      this.registerFailedWhack();
    }
  }

  animateCard(card, animation) {
    card.classList.add(animation);
    setTimeout(() => {
      card.classList.remove(animation);
    }, this.options.NEUTRAL_TIME);
  }

  registerValidWhack() {
    this.isCurrentPositionWhacked = true;
  }

  registerFailedWhack() {
    this.isCurrentPositionWhacked = false;
  }

  async changeActiveCard() {
    if (this.currentPosition) this.deactivateCard(this.currentPosition);
    const nextPosition = this.getNextPosition();
    await this.waitMs(this.options.NEUTRAL_TIME);
    this.activateCard(nextPosition);
    this.currentPosition = nextPosition;
  }

  updateStats() {
    if (this.isCurrentPositionWhacked) {
      this.processValidWhack();
    } else {
      this.processFailedWhack();
    }
  }

  processValidWhack() {
    this.stats.score.increase();
  }

  processFailedWhack() {
    this.stats.score.resetConsecutiveWhacks();
  }

  deactivateCard(cardPosition) {
    this.gameBoard
      .querySelector(`#sq${cardPosition}`)
      .classList.remove('active');
  }

  waitMs(miliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, miliseconds);
    });
  }

  executeGameCycle() {
    this.updateGameState();
    this.changeActiveCard();
  }

  updateGameState() {
    this.updateStats();
    this.isCurrentPositionWhacked = false;
  }
  pause() {
    clearInterval(this.gameLoop);
  }

  resume() {
    this.startGameLoop();
  }

  quit() {
    clearInterval(this.gameLoop);
    this.resetStats();
    this.resetGrid();
    /* can't remove it like this because the actual listener is not whackHandler, 
    it's a binded instance of it - whackHandler.bind(this) */
    // this.gameBoard.removeEventListener('click', this.whackHandler);
    DOMHelper.clearEventListeners(this.gameBoard);
  }

  resetStats() {
    this.stats.score.resetAll();
  }

  resetGrid() {
    let activeCards = this.gameBoard.querySelectorAll('.game__square.active');
    activeCards.forEach(card => card.classList.remove('active'));
    activeCards = this.gameBoard.querySelectorAll('.game__square.active');
  }

  dispatchGameOver() {
    const { whacks, points } = this.stats.score;

    const gameOverEvent = new CustomEvent('gameover', {
      detail: { gameStats: { whacks, points } },
    });
    this.gameBoard.closest('.game').dispatchEvent(gameOverEvent);
  }
}
