import Game from './Game.js';
import { GAME_OPTIONS } from './config.js';

export default class BattleGame extends Game {
  constructor(userOptions) {
    super(userOptions);

    Object.assign(this.stats, {
      time: {
        el: document.querySelector('#remaining-time'),
        remainingTime: GAME_OPTIONS.mode.battle.ROUND_TIME,
        startCountdown() {
          this.countdown = setInterval(() => {
            this.remainingTime--;
            this.el.textContent = this.remainingTime;
          }, 1000);
        },
        setBattleTime() {
          this.battleTimer = setTimeout(() => {
            clearInterval(this.countdown);
            clearInterval(this.gameLoop);
            alert('Battle over! 😎');
            clearTimeout(this.battleTimer);
          }, (this.remainingTime + 1) * 1000);
        },
        startTimer() {
          this.startCountdown();
          this.setBattleTime();
        },
        pauseTimer() {
          clearInterval(this.countdown);
          clearTimeout(this.battleTimer);
        },
      },
    });
  }

  startGameLoop() {
    this.stats.time.startTimer();
    this.gameLoop = setInterval(
      this.executeGameCycle.bind(this),
      this.options.CYCLE_TIME
    );
    this.stats.time.gameLoop = this.gameLoop;
  }

  pause() {
    Game.prototype.pause.call(this);
    this.stats.time.pauseTimer();
  }

  quit() {
    Game.prototype.quit.call(this);
    this.stats.time.pauseTimer();
  }

  resetStats() {
    Game.prototype.resetStats.call(this);
    this.stats.time.el.textContent = GAME_OPTIONS.mode.battle.ROUND_TIME;
  }

  processFailedWhack() {
    console.log('You failed to whack');
    // subtract 5 seconds from remainingTime
  }
}
