const NUMBER_OF_CARDS = 9;

const GAME_OPTIONS = {
  mode: {
    survival: {
      lives: 3,
    },
    battle: {
      ROUND_TIME: 60,
    },
    SURVIVAL: 'survival',
    BATTLE: 'battle',
  },
  difficulty: {
    easy: {
      ACTIVE_TIME: 800,
      NEUTRAL_TIME: 800,
    },
    hard: {
      ACTIVE_TIME: 400,
      NEUTRAL_TIME: 400,
    },
  },
};

export { NUMBER_OF_CARDS, GAME_OPTIONS };
