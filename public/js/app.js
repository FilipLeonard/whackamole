import GameController from './App/GameController.js';

document.querySelector('.join-options').addEventListener('click', e => {
  const userOption = e.target.closest('.join-option');
  if (!userOption) return;
  const allRelatedOptions = userOption.parentNode.children;
  for (const availableOption of allRelatedOptions) {
    if (userOption === availableOption) {
      availableOption.classList.add('btn-main__active');
      availableOption.classList.remove('btn-main__inactive');
    } else {
      availableOption.classList.remove('btn-main__active');
      availableOption.classList.add('btn-main__inactive');
    }
  }
});

class App {
  static init() {
    new GameController();
  }
}

App.init();
