const NUMBER_OF_CARDS = 9;

const GAME_OPTIONS = {
  mode: {
    survival: {
      lives: 3,
    },
    battle: {
      ROUND_TIME: 3,
    },
    SURVIVAL: 'survival',
    BATTLE: 'battle',
  },
  difficulty: {
    easy: {
      ACTIVE_TIME: 700,
      NEUTRAL_TIME: 700,
    },
    hard: {
      ACTIVE_TIME: 500,
      NEUTRAL_TIME: 500,
    },
  },
};

export { NUMBER_OF_CARDS, GAME_OPTIONS };
