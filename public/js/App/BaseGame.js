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
        el: document.querySelector('#current-score'),
        whacks: 0,
        points: 0,
        add(addition) {
          this.whacks += addition;
          this.el.textContent = this.whacks;
        },
        reset() {
          this.add(-this.whacks);
        },
      },
    };
    this.gameGrid = document.querySelector('.game__grid');
  }

  start() {
    this.setupGame();
    this.startGameLoop();
  }

  setupGame() {
    this.setupInitialPosition();
    this.gameGrid.addEventListener('click', this.whackHandler.bind(this));
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
    this.gameGrid.querySelector(`#sq${cardPosition}`).classList.add('active');
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
    this.stats.score.add(1);
  }

  deactivateCard(cardPosition) {
    this.gameGrid
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
    // this.gameGrid.removeEventListener('click', this.whackHandler);
    DOMHelper.clearEventListeners(this.gameGrid);
  }

  resetStats() {
    this.stats.score.reset();
  }

  resetGrid() {
    let activeCards = this.gameGrid.querySelectorAll('.game__square.active');
    activeCards.forEach(card => card.classList.remove('active'));
    activeCards = this.gameGrid.querySelectorAll('.game__square.active');
  }

  dispatchGameOver() {
    const { whacks, points } = this.stats.score;

    const gameOverEvent = new CustomEvent('gameover', {
      detail: { gameStats: { whacks, points } },
    });
    this.gameGrid.closest('.game').dispatchEvent(gameOverEvent);
  }
}
