import { GAME_OPTIONS } from './game-config.js';
import BattleGame from './BattleGame.js';
import SurvivalGame from './SurvivalGame.js';

export default class GameFactory {
  static getGame(userOptions) {
    if (userOptions.mode === GAME_OPTIONS.mode.SURVIVAL)
      return new SurvivalGame(userOptions);
    if (userOptions.mode === GAME_OPTIONS.mode.BATTLE)
      return new BattleGame(userOptions);
  }
}
