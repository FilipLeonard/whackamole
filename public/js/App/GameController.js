import GameFactory from './gamefactory.js';
import DOMHelper from './utility/domhelper.js';
import Backend from './utility/backend.js';

const MIN_LENGTH_PLAYER_NAME = 5;
const MODALS = {
  CANCEL_GAME: 'cancel',
  GAME_RESULTS: 'results',
};

export default class GameController {
  constructor() {
    this.connectStartButton();
    this.connectCancelGameButton();
    this.connectGameOverHandler();
  }

  connectStartButton() {
    document
      .querySelector('.btn-start-game')
      .addEventListener('click', this.startButtonHandler.bind(this));
  }

  async startButtonHandler() {
    const details = this.getNewGameDetails();
    try {
      const result = await Backend.startNewGame(details);
      this.gameId = result.game._id;
    } catch (error) {
      // render error messages
      return console.error(error);
    }
    this.game = GameFactory.getGame(this.userOptions);
    this.displayGameView();
    this.game.start();
  }

  getNewGameDetails() {
    this.playerName = this.getPlayerName();
    this.userOptions = this.getUserOptions();
    return {
      name: this.playerName,
      ...this.userOptions,
    };
  }

  getUserOptions() {
    const userSelection = document.querySelectorAll(
      '.join-options .btn-main__active'
    );
    const [{ mode }, { difficulty }] = [...userSelection].map(el => el.dataset);
    return { mode, difficulty };
  }

  getPlayerName() {
    const name = document.querySelector('.join .name-input').value;
    if (name.length < MIN_LENGTH_PLAYER_NAME)
      throw new Error('Player name minimum length is 5 characters');
    return name;
  }

  displayGameView() {
    DOMHelper.displayElement(`#${this.userOptions.mode}-label`);
    DOMHelper.displaySection('game');
  }

  connectCancelGameButton() {
    this.connectModal(MODALS.CANCEL_GAME);
    document
      .querySelector('#game-back')
      .addEventListener('click', this.backButtonHandler.bind(this));
  }

  connectModal(modalType) {
    console.log('connectModal', { modalType });

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
    DOMHelper.hideElement(`#${this.userOptions.mode}-label`);
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
    DOMHelper.hideElement(`#${this.userOptions.mode}-label`);
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
    console.log('connectGameOverHandler');
    this.connectModal(MODALS.GAME_RESULTS);
    const gameSection = document.querySelector('.game');
    console.log({ gameSection });
    gameSection.addEventListener('gameover', this.gameOverHandler.bind(this));
  }

  async gameOverHandler(gameOverEvent) {
    console.log('Handling gameover', { gameOverEvent });
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
