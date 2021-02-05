const Player = require('../models/player');
const Dynasty = require('../models/dynasty');
const Game = require('../models/game');

exports.getIndex = (req, res, next) => {
  res.render('index');
};

exports.putGameStart = async (req, res, next) => {
  const { name, mode, difficulty } = req.body;
  let status = 200;

  let player = await Player.findOne({ name });

  if (!player) {
    const dynasty = await Dynasty.findOne({ house: 'Stark' });
    player = new Player({
      name,
      lastPlayed: new Date(),
      dynasty: dynasty,
    });
    status = 201; // creating new player
  }

  player.gamesStarted++;
  await player.save();

  const newGame = new Game({
    mode,
    difficulty,
    player,
  });

  const result = await newGame.save();

  res.status(status).json({ message: 'Starting new game..', game: newGame });
};

exports.patchGameCancel = async (req, res, next) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    // TODO error handling
  }
  game.state = 'canceled';
  await game.save();

  res.status(200).json({
    message: 'Game canceled',
  });
};
