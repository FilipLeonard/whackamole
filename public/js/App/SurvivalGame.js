import Game from './Game.js';

export default class SurvivalGame extends Game {
  constructor(userOptions) {
    super(userOptions);
    Object.assign(this.stats, {
      lives: {
        el: document.querySelector('#remaining-lives'),
        remainingLives: 3,
        looseOne() {
          this.remainingLives--;
          this.el.textContent = this.remainingLives;
        },
      },
    });
  }

  startGameLoop() {
    this.gameLoop = setInterval(
      this.executeGameCycle.bind(this),
      this.options.CYCLE_TIME
    );
    this.stats.lives.gameLoop = this.gameLoop;
  }

  processFailedWhack() {
    this.stats.lives.looseOne();
    if (this.stats.lives.remainingLives === 0) {
      clearInterval(this.gameLoop);
      this.dispatchGameOver();
    }
  }

  resetStats() {
    Game.prototype.resetStats.call(this);
    // TODO add magic number to in config.js
    this.stats.lives.el.textContent = 3;
  }
}
