import { GAME_OPTIONS } from './config.js';
import BattleGame from './BattleGame.js';
import SurvivalGame from './SurvivalGame.js';

class GameFactory {
  // export default class GameFactory {
  static getGame(userOptions) {
    if (userOptions.mode === GAME_OPTIONS.mode.SURVIVAL)
      return new SurvivalGame(userOptions);
    if (userOptions.mode === GAME_OPTIONS.mode.BATTLE)
      return new BattleGame(userOptions);
  }
}
