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

  await newGame.save();

  res.status(status).json({ message: 'Starting new game..', game: newGame });
};

exports.patchGameCancel = async (req, res, next) => {
  const { gameId } = req.params;
  const game = await Game.findById(gameId);
  if (!game) {
    // TODO error handling
  }
  game.state = 'cancelled';
  await game.save();

  res.status(200).json({
    message: 'Game canceled',
  });
};

exports.patchGameFinish = async (req, res, next) => {
  const { gameId } = req.params;
  const { whacks, points } = req.body;
  const game = await Game.findById(gameId);
  if (!game) {
    // TODO error handling
  }
  game.state = 'finished';
  game.whacks = whacks;
  game.partialPoints = points;
  const finishedGame = await game.save();
  res.status(200).json({
    message: 'Game finished',
  });
};

exports.patchSubmitScore = async (req, res, next) => {
  const { gameId } = req.params;

  const game = await Game.findById(gameId);
  if (!game) {
    // TODO error handling
  }
  game.state = 'submitted';
  game.points = game.partialPoints;
  const finalGame = await game.save();
  res.status(200).json({
    message: 'Score submitted successfully..',
  });
};

exports.getLeaderboard = async (req, res, next) => {
  const topGames = await Game.find()
    .populate('player')
    .sort('-partialPoints')
    .limit(10); // TODO magic number
  if (!topGames) {
    // TODO error handling
  }
  const leaderboard = topGames.map(game => ({
    playerName: game.player.name,
    mode: game.mode,
    difficulty: game.difficulty,
    points: game.partialPoints,
  }));
  res.status(200).json({
    message: 'Leaderboard retrieved successfully..',
    leaderboard,
  });
};
