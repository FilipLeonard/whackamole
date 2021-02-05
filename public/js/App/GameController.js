import GameFactory from './GameFactory.js';
import DOMHelper from './Utility/DOMHelper.js';

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
      .querySelector('.join__btn')
      .addEventListener('click', this.startButtonHandler.bind(this));
  }

  async startButtonHandler() {
    this.userOptions = this.getUserOptions();
    try {
      const playerName = this.getPlayerName();
      const newGameDetails = {
        name: playerName,
        ...this.userOptions,
      };
      const res = await fetch('/game-start', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGameDetails),
      });
      if (!res.ok) {
        throw new Error('Failed to start a new game..');
      }
      const { game } = await res.json();
      this.gameId = game._id;
    } catch (error) {
      // render error messages
      return console.error(error);
    }
    this.game = GameFactory.getGame(this.userOptions);
    this.displayGameView();
    this.game.start();
  }

  getPlayerName() {
    const name = document.querySelector('.join .name-input').value;
    if (name.length < MIN_LENGTH_PLAYER_NAME)
      throw new Error('Player name minimum length is 5 characters');
    return name;
  }

  getUserOptions() {
    const userSelection = document.querySelectorAll(
      '.join-options .btn-main__active'
    );
    const [{ mode }, { difficulty }] = [...userSelection].map(el => el.dataset);
    return { mode, difficulty };
  }

  connectBackButton() {
    this.connectModal(MODALS.CANCEL_GAME);
    document
      .querySelector('#game-back')
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
    const playerConfirmsCancel = action.classList.contains(
      'modal__action--cancel'
    );
    const playerResumesGame = action.classList.contains(
      'modal__action--resume'
    );
    if (playerConfirmsCancel) {
      this.game.quit();
      try {
        const res = await fetch(`/game-cancel/${this.gameId}`, {
          method: 'PATCH',
        });
        if (!res.ok) {
          throw new Error('Failed to cancel new game..');
        }
        const { message } = await res.json();
        console.log({ message });
        // reset some state TODO: reset everything relevant
        this.gameId = null;
        // TODO render user message
      } catch (error) {
        // render error messages
        return console.error(error);
      }
      this.displayHomeScreen();
    } else if (playerResumesGame) {
      this.game.resume();
    }
    this.hideModal(MODALS.CANCEL_GAME);
  }

  async modalResultsHandler(e) {
    const action = e.target.closest('.modal__action');
    if (!action) return;
    this.game.quit();
    const playerChoseSumbit = action.classList.contains(
      'modal__action--submit'
    );
    const playerChoseNewGame = action.classList.contains(
      'modal__action--new-game'
    );
    if (playerChoseSumbit) {
      try {
        console.log('Submitting score to server..');
      } catch (error) {
        // render error messages
        return console.error(error);
      }
      this.displayResultsView();
    } else if (playerChoseNewGame) {
      this.displayHomeScreen();
    }
    this.hideModal(MODALS.GAME_RESULTS);
  }

  displayResultsView() {
    DOMHelper.hideElement(`#${this.userOptions.mode}-label`);
    DOMHelper.displaySection('results');
  }

  backButtonHandler() {
    this.game.pause();
    this.showModal(MODALS.CANCEL_GAME);
  }

  showModal(modalType) {
    ['.backdrop', `.modal--${modalType}`].forEach(DOMHelper.displayElement);
  }

  hideModal(modalType) {
    ['.backdrop', `.modal--${modalType}`].forEach(DOMHelper.hideElement);
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
    this.connectModal(MODALS.GAME_RESULTS);
    document
      .querySelector('.game')
      .addEventListener('gameover', this.gameOverHandler.bind(this));
    // document
    //   .querySelector('.result__actions')
    //   .addEventListener('click', this.gameOverActionsHandler.bind(this));
  }

  gameOverHandler({ detail: whacks }) {
    // PATCH /game-over
    // this.displayResultsView(whacks);
    document.querySelector('#result__whacks').textContent = whacks;
    document.querySelector('#result__points').textContent = whacks * 35_000;
    this.showModal(MODALS.GAME_RESULTS);
  }
}
