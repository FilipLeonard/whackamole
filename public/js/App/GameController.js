import GameFactory from './GameFactory.js';
import DOMHelper from './Utility/DOMHelper.js';

export default class GameController {
  constructor() {
    this.connectStartButton();
    this.connectBackButton();
    this.connectGameOverHandler();
  }

  connectStartButton() {
    document
      .querySelector('.join__btn')
      .addEventListener('click', this.startButtonHandler.bind(this));
  }

  startButtonHandler() {
    this.userOptions = this.getUserOptions();
    this.game = GameFactory.getGame(this.userOptions);
    this.displayGameView();
    this.game.start();
  }

  getUserOptions() {
    const userSelection = document.querySelectorAll(
      '.join-options .btn-main__active'
    );
    const [{ mode }, { difficulty }] = [...userSelection].map(el => el.dataset);
    return { mode, difficulty };
  }

  connectBackButton() {
    this.connectModal();
    document
      .querySelector('#game-back')
      .addEventListener('click', this.backButtonHandler.bind(this));
  }

  connectModal() {
    document
      .querySelector('.modal__actions')
      .addEventListener('click', this.modalActionsHandler.bind(this));
  }

  modalActionsHandler(e) {
    const action = e.target.closest('.modal__action');
    if (!action) return;
    const isUserChoiceYes = action.classList.contains(
      'modal__action--positive'
    );
    if (isUserChoiceYes) {
      this.game.quit();
      this.displayHomeScreen();
    } else {
      this.game.resume();
    }
    this.hideModal();
  }

  backButtonHandler() {
    this.game.pause();
    this.showModal();
  }

  showModal() {
    ['.backdrop', '.modal'].forEach(DOMHelper.displayElement);
  }

  hideModal() {
    ['.backdrop', '.modal'].forEach(DOMHelper.hideElement);
  }

  displayGameView() {
    DOMHelper.displayElement(`#${this.userOptions.mode}-label`);
    DOMHelper.displaySection('game');
  }

  displayHomeScreen() {
    DOMHelper.hideElement(`#${this.userOptions.mode}-label`);
    DOMHelper.displaySection('join');
  }

  connectGameOverHandler() {
    document
      .querySelector('.game')
      .addEventListener('gameover', this.gameOverHandler.bind(this));
    document
      .querySelector('.result__actions')
      .addEventListener('click', this.gameOverActionsHandler.bind(this));
  }

  gameOverHandler({ detail: whacks }) {
    this.displayResultsView(whacks);
  }

  displayResultsView(whacks) {
    DOMHelper.hideElement(`#${this.userOptions.mode}-label`);
    document.querySelector('#result__whacks').textContent = whacks;
    document.querySelector('#result__points').textContent = whacks * 35_000;
    DOMHelper.displaySection('results');
  }

  gameOverActionsHandler(e) {
    const action = e.target.closest('.result__action');
    if (!action) return;
    this.game.quit();
    const submitScore = action.classList.contains('result__action--submit');
    if (submitScore) {
      console.log('Submitting score to server..');
    } else {
      this.displayHomeScreen();
    }
  }
}
