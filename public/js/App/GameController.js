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
    Backend.getLeaderboard().then(ldbrd => {
      this.leaderboard = ldbrd;
      this.updateResultsView();
      this.displayResultsView();
    });
  }

  connectStartButton() {
    document
      .querySelector('.btn-start-game')
      .addEventListener('click', this.startButtonHandler.bind(this));
  }

  async startButtonHandler() {
    try {
      const playerInput = this.getPlayerInput();
      const result = await Backend.startNewGame(playerInput);
      console.log(`Backend message: ${result.message}`);
      this.gameId = result.data.gameId;
    } catch (error) {
      // flash message with both backend error and name validation error
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

  getPlayerName() {
    const nameInput = document.querySelector('.join .name-input');
    const name = nameInput.value.trim();
    if (name.length < MIN_LENGTH_PLAYER_NAME) {
      this.flashErrorMessage(
        nameInput.parentNode,
        `Minimum ${MIN_LENGTH_PLAYER_NAME} characters`
      );
      throw new Error(
        `Player name min length is ${MIN_LENGTH_PLAYER_NAME} characters`
      );
    }
    return name;
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

  getPlayerOptions() {
    const playerSelection = document.querySelectorAll(
      '.join-options .btn-main__active'
    );
    const [{ mode }, { difficulty }] = [...playerSelection].map(
      el => el.dataset
    );
    return { mode, difficulty };
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

  modalCancelHandler(e) {
    const action = e.target.closest('.modal__action');
    if (!action) return;
    const playerAction = {
      isConfirmCancel: action.classList.contains('modal__action--cancel'),
      isResumeGame: action.classList.contains('modal__action--resume'),
    };
    if (playerAction.isConfirmCancel) {
      this.game.quit();
      this.persistGameCancellation();
      this.displayHomeScreen();
      this.clearGameData();
    } else if (playerAction.isResumeGame) {
      this.game.resume();
    }
    this.hideModal(MODALS.CANCEL_GAME);
  }

  async persistGameCancellation() {
    try {
      const result = await Backend.cancelGame(this.gameId);
      console.log(`Backend message: ${result.message}`);
    } catch (error) {
      console.log('❌❌Game cancel error', { error });
    }
  }

  clearGameData() {
    this.gameId = null;
    this.playerName = null;
    this.playerOptions = null;
    this.leaderboard = null; // ??
  }

  displayHomeScreen() {
    DOMHelper.hideElement('#header__back');
    DOMHelper.hideElement(`#${this.playerOptions.mode}-label`);
    DOMHelper.displaySection('join');
  }

  hideModal(modalType) {
    DOMHelper.removeClass('.backdrop', 'visible');
    DOMHelper.removeClass(`.modal--${modalType}`, 'visible');
    setTimeout(() => {
      DOMHelper.addClass('.backdrop', 'hidden');
    }, 300);
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
      await this.persistScore();
      await this.retrieveLeaderboard();
      this.updateResultsView();
      this.displayResultsView();
    } else if (playerAction.isStartNewGame) {
      this.displayHomeScreen();
      this.clearGameData();
    }
    this.hideModal(MODALS.GAME_RESULTS);
  }

  async persistScore() {
    try {
      let res = await Backend.submitScore(this.gameId);
      console.log(`Backend message: ${res.message}`);
    } catch (error) {
      console.log('Persist score backend error', { error });
    }
  }

  async retrieveLeaderboard() {
    try {
      this.leaderboard = await Backend.getLeaderboard();
    } catch (error) {
      console.log('Retrieve leaderboard backend error', { error });
    }
  }

  updateResultsView() {
    const markup = `${this.leaderboard
      .map((game, idx) => {
        return `
          <li class="results__player">
            <div class="results__player--rank"><span>${idx + 1}</span></div>
            <div class="results__player--name gradient-text">${
              game.playerName
            }</div>
            <div class="results__player--points gradient-text">${
              game.points
            }</div>
            <div class="results__player--mode label">${game.mode}</div>
            <div class="results__player--difficulty label">${
              game.difficulty
            }</div>
          </li>`;
      })
      .join(' ')}
    `;
    const resultsContainer = document.querySelector('.results__players');
    resultsContainer.innerHTML = '';
    resultsContainer.insertAdjacentHTML('afterbegin', markup);
  }

  displayResultsView() {
    // DOMHelper.hideElement(`#${this.playerOptions.mode}-label`);
    DOMHelper.displaySection('results');
  }

  backButtonHandler() {
    const visibleSection = DOMHelper.getVisibleSection();
    if (visibleSection === 'game') {
      this.game.pause();
      this.showModal(MODALS.CANCEL_GAME);
    } else if (visibleSection === 'results') {
      this.displayHomeScreen();
      this.clearGameData();
    }
  }

  showModal(modalType) {
    DOMHelper.removeClass('.backdrop', 'hidden');
    DOMHelper.removeClass(`.modal--${modalType}`, 'hidden');
    setTimeout(() => {
      DOMHelper.addClass('.backdrop', 'visible');
      DOMHelper.addClass(`.modal--${modalType}`, 'visible');
    }, 10);
  }

  connectGameOverHandler() {
    this.connectModal(MODALS.GAME_RESULTS);
    document
      .querySelector('.game')
      .addEventListener('gameover', this.gameOverHandler.bind(this));
  }

  async gameOverHandler(gameOverEvent) {
    const { gameStats } = gameOverEvent.detail;
    let partialPoints = gameStats.whacks;
    try {
      const res = await Backend.finishGame(this.gameId, gameStats);
      console.log(`Backend message: ${res.message}`);
      partialPoints = res.data.partialPoints;
    } catch (error) {
      console.log('Game over backend error', { error });
    }
    this.populateResultsModal({
      whacks: gameStats.whacks,
      points: partialPoints,
    });
    this.showModal(MODALS.GAME_RESULTS);
  }

  populateResultsModal(gameStats) {
    document.querySelector('#result__whacks').textContent = gameStats.whacks;
    document.querySelector('#result__points').textContent = gameStats.points;
  }
}
