import GameFactory from './App/GameFactory.js';

document.querySelector('.join-options').addEventListener('click', e => {
  const userOption = e.target.closest('.join-option');
  if (!userOption) return;
  const allRelatedOptions = userOption.parentNode.children;
  for (const availableOption of allRelatedOptions) {
    const action = userOption === availableOption ? 'add' : 'remove';
    availableOption.classList[action]('btn-main__active');
  }
});

class App {
  constructor() {
    this.newGame();
    this.backdrop = document.querySelector('.backdrop');
    this.modal = document.querySelector('.modal');
  }

  async init() {
    await this.newGame();
    this.connectBackButton();
    this.displayGameView();
    this.game.start();
  }

  static getUserOptions() {
    return new Promise(resolve => {
      document.querySelector('.join__btn').addEventListener('click', e => {
        e.preventDefault();
        const userSelection = document.querySelectorAll(
          '.join-options .btn-main__active'
        );
        const [{ mode }, { difficulty }] = [...userSelection].map(
          el => el.dataset
        );
        resolve({ mode, difficulty });
      });
    });
  }

  async newGame() {
    this.userOptions = await App.getUserOptions();
    this.game = GameFactory.getGame(this.userOptions);
  }

  connectBackButton() {
    this.connectModal();
    document.querySelector('#game-back').addEventListener('click', e => {
      this.game.pauseGame();
      this.showModal();
    });
  }

  connectModal() {
    document.querySelector('.modal__actions').addEventListener('click', e => {
      const action = e.target.closest('.modal__action');
      if (!action) return;
      const isUserChoiceYes = action.classList.contains(
        'modal__action--positive'
      );
      const isUserChoiceNo = action.classList.contains(
        'modal__action--negative'
      );
      this.hideModal();
      if (isUserChoiceYes) {
        this.game.quit();
        this.displayHomeScreen();
        this.init();
      } else {
        this.game.resumeGame();
      }
    });
  }

  showModal() {
    [this.backdrop, this.modal].forEach(el => el.classList.remove('hidden'));
  }

  hideModal() {
    [this.backdrop, this.modal].forEach(el => el.classList.add('hidden'));
  }

  displayGameView() {
    this.hideElement('.join');
    this.displayElement(`#${this.userOptions.mode}-label`);
    this.displayElement('.game');
  }

  displayHomeScreen() {
    this.hideElement(`#${this.userOptions.mode}-label`);
    this.hideElement('.game');
    this.displayElement('.join');
  }

  displayElement(selector) {
    document.querySelector(selector).classList.remove('hidden');
  }

  hideElement(selector) {
    document.querySelector(selector).classList.add('hidden');
  }
}

const app = new App();
app.init();
