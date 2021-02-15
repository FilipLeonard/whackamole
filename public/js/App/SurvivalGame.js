import Game from './BaseGame.js';
import DOMHelper from './Utility/DOMHelper.js';

export default class SurvivalGame extends Game {
  constructor(userOptions) {
    super(userOptions);
    Object.assign(this.stats, {
      resources: {
        el: document.querySelector('#remaining-lives'),
        remainingLives: 3,
        decreaseLives() {
          this.looseOne();
          if (this.remainingLives === 0) {
            clearInterval(this._gameLoop);
            this._dispatchGameOver();
          }
        },
        looseOne() {
          this.remainingLives--;
          this.el.textContent = this.remainingLives;
          DOMHelper.animateElement(
            this.el.previousElementSibling,
            'scale',
            500
          );
        },
        _dispatchGameOver: this.dispatchGameOver.bind(this),
      },
    });
  }

  startGameLoop() {
    this.gameLoop = setInterval(
      this.executeGameCycle.bind(this),
      this.options.CYCLE_TIME
    );
    this.stats.resources._gameLoop = this.gameLoop;
  }

  processFailedWhack() {
    Game.prototype.processFailedWhack.call(this);
    this.stats.resources.decreaseLives();
  }

  resetStats() {
    Game.prototype.resetStats.call(this);
    this.stats.resources.el.textContent = 3;
  }
}
