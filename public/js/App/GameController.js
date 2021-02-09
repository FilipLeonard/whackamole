import GameFactory from './GameFactory.js';
import DOMHelper from './Utility/DOMHelper.js';
import Backend from './Utility/Backend.js';

const MIN_LENGTH_PLAYER_NAME = 5;
const MODALS = {
  CANCEL_GAME: 'cancel',
  GAME_RESULTS: 'results',
};

export default class GameController {
  constructor() {
    this.connectStartButton();
    this.connectBackButton();
    this.connectGameOverHandler();
  }

  connectStartButton() {
    document
      .querySelector('.btn-start-game')
      .addEventListener('click', this.startButtonHandler.bind(this));
  }

  async startButtonHandler() {
    try {
      const userInput = this.getPlayerInput();
      const result = await Backend.startNewGame(userInput);
      this.gameId = result.game._id;
    } catch (error) {
      // render error messages
      return console.error(`🚫🚫 ${error}`);
    }
    this.game = GameFactory.getGame(this.playerOptions);
    this.displayGameView();
    this.game.start();
  }

  getPlayerInput() {
    this.playerName = this.getPlayerName();
    this.playerOptions = this.getPlayerOptions();
    return {
      name: this.playerName,
      ...this.playerOptions,
    };
  }

  getPlayerOptions() {
    const playerSelection = document.querySelectorAll(
      '.join-options .btn-main__active'
    );
    const [{ mode }, { difficulty }] = [...playerSelection].map(
      el => el.dataset
    );
    return { mode, difficulty };
  }

  getPlayerName() {
    const nameInput = document.querySelector('.join .name-input');
    if (nameInput.value.length < MIN_LENGTH_PLAYER_NAME) {
      this.flashErrorMessage(
        nameInput.parentNode,
        'Name length - minimum 5 characters'
      );
      throw new Error('Player name minimum length is 5 characters');
    }
    return nameInput.value;
  }

  flashErrorMessage(targetEl, message) {
    const errorNode = document.createElement('span');
    const errorMessage = document.createTextNode(message);
    errorNode.appendChild(errorMessage);
    errorNode.setAttribute('style', 'color:red; position: absolute; top: 26%;');

    targetEl.insertAdjacentElement('beforebegin', errorNode);
    const to = setTimeout(() => {
      errorNode.remove();
      clearTimeout(to);
    }, 1500);
  }

  displayGameView() {
    DOMHelper.displayElement('#header__back');
    DOMHelper.displayElement(`#${this.playerOptions.mode}-label`);
    DOMHelper.displaySection('game');
  }

  connectBackButton() {
    this.connectModal(MODALS.CANCEL_GAME);
    document
      .querySelector('#header__back')
      .addEventListener('click', this.backButtonHandler.bind(this));
  }

  connectModal(modalType) {
    document
      .querySelector(`.modal--${modalType} .modal__actions`)
      .addEventListener('click', this.getModalHandler(modalType));
  }

  getModalHandler(modalType) {
    switch (modalType) {
      case MODALS.CANCEL_GAME:
        return this.modalCancelHandler.bind(this);
      case MODALS.GAME_RESULTS:
        return this.modalResultsHandler.bind(this);
      default:
        throw new Error(`Invalid modal type ${modalType}.`);
    }
  }

  async modalCancelHandler(e) {
    const action = e.target.closest('.modal__action');
    if (!action) return;
    const playerAction = {
      isConfirmCancel: action.classList.contains('modal__action--cancel'),
      isResumeGame: action.classList.contains('modal__action--resume'),
    };
    if (playerAction.isConfirmCancel) {
      this.game.quit();
      await Backend.cancelGame(this.gameId);
      this.gameId = null; // TODO: reset everything relevant
      this.displayHomeScreen();
    } else if (playerAction.isResumeGame) {
      this.game.resume();
    }
    this.hideModal(MODALS.CANCEL_GAME);
  }

  displayHomeScreen() {
    DOMHelper.hideElement('#header__back');
    DOMHelper.hideElement(`#${this.playerOptions.mode}-label`);
    DOMHelper.displaySection('join');
  }

  hideModal(modalType) {
    ['.backdrop', `.modal--${modalType}`].forEach(DOMHelper.hideElement);
  }

  async modalResultsHandler(e) {
    const action = e.target.closest('.modal__action');
    if (!action) return;
    this.game.quit();
    const playerAction = {
      isSubmitScore: action.classList.contains('modal__action--submit'),
      isStartNewGame: action.classList.contains('modal__action--new-game'),
    };
    if (playerAction.isSubmitScore) {
      await Backend.submitScore(this.gameId);
      const { leaderboard } = await Backend.getLeaderboard();
      this.renderResultsView(leaderboard);
      this.displayResultsView();
    } else if (playerAction.isStartNewGame) {
      this.displayHomeScreen();
    }
    this.hideModal(MODALS.GAME_RESULTS);
  }

  renderResultsView(leaderboard) {
    const markup = `${leaderboard
      .map(
        game =>
          `<li class="results__player">${game.playerName} ${game.points}</li>`
      )
      .join(' ')}
    `;
    const resultsContainer = document.querySelector('.results__players');
    resultsContainer.innerHTML = '';
    resultsContainer.insertAdjacentHTML('afterbegin', markup);
  }

  displayResultsView() {
    DOMHelper.hideElement(`#${this.playerOptions.mode}-label`);
    DOMHelper.displaySection('results');
  }

  backButtonHandler() {
    const visibleSection = DOMHelper.getVisibleSection();
    if (visibleSection === 'game') {
      this.game.pause();
      this.showModal(MODALS.CANCEL_GAME);
    } else if (visibleSection === 'results') {
      this.displayHomeScreen();
    }
  }

  showModal(modalType) {
    ['.backdrop', `.modal--${modalType}`].forEach(DOMHelper.displayElement);
  }

  connectGameOverHandler() {
    this.connectModal(MODALS.GAME_RESULTS);
    const gameSection = document.querySelector('.game');
    gameSection.addEventListener('gameover', this.gameOverHandler.bind(this));
  }

  async gameOverHandler(gameOverEvent) {
    const { gameStats } = gameOverEvent.detail;
    const finishResult = await Backend.finishGame(this.gameId, gameStats);
    this.populateResultsModal({
      whacks: gameStats.whacks,
      points: finishResult.partialPoints,
    });
    this.showModal(MODALS.GAME_RESULTS);
  }

  populateResultsModal(gameStats) {
    document.querySelector('#result__whacks').textContent = gameStats.whacks;
    document.querySelector('#result__points').textContent = gameStats.points;
  }
}
