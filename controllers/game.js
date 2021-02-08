const Player = require('../models/player');
const Dynasty = require('../models/dynasty');
const Game = require('../models/game');
const Scoring = require('../models/scoring');

exports.getIndex = async (req, res, next) => {
  // const easyScoring = await Scoring.findOne({ difficulty: 'easy' });
  // if (easyScoring) {
  //   console.log('🎈🎈🎈easy scoring in place', { easyScoring });
  // } else {
  //   console.log(`🛑🛑🛑Scoring for difficulty ${'easy'} doesn't exist;`);
  //   const scoring = new Scoring();
  //   const newScoringResult = await scoring.save();
  //   console.log('new scoring created', { newScoringResult });
  // }
  // await Scoring.calculatePoints('easy', 40);

  res.render('index');
};

exports.putGameStart = async (req, res) => {
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

exports.patchGameCancel = async (req, res) => {
  const { gameId } = req.params;
  const runningGame = await Game.findById(gameId);
  if (!runningGame) {
    // TODO error handling
  }
  runningGame.state = 'cancelled';
  await runningGame.save();

  res.status(200).json({
    message: 'Game canceled',
  });
};

exports.patchGameFinish = async (req, res, next) => {
  const { gameId } = req.params;
  const { whacks, points } = req.body;
  const runningGame = await Game.findById(gameId);
  if (!runningGame) {
    runningGame;
    // TODO error handling
  }
  runningGame.state = 'finished';
  runningGame.whacks = whacks;
  const partialPoints = await Scoring.calculatePoints('easy', whacks);
  runningGame.partialPoints = partialPoints;
  const finishedGame = await runningGame.save();
  res.status(200).json({
    message: 'Game finished',
    partialPoints,
  });
};

exports.patchSubmitScore = async (req, res, next) => {
  const { gameId } = req.params;

  const finishedGame = await Game.findById(gameId);
  if (!finishedGame) {
    // TODO error handling
  }
  finishedGame.state = 'submitted';
  finishedGame.points = finishedGame.partialPoints;
  const submittedGame = await finishedGame.save();
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
