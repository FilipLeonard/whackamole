const Player = require('../models/player');
const Dynasty = require('../models/dynasty');
const Game = require('../models/game');
const Scoring = require('../models/scoring');

exports.getIndex = (req, res, next) => {
  res.status(200).render('index');
};

exports.putGameStart = async (req, res, next) => {
  const { name, mode, difficulty } = req.body;
  let status = 200;
  try {
    let player = await Player.findOne({ name });
    if (!player) {
      const dynasty = await Dynasty.findOne({ house: 'Stark' });
      if (!dynasty) throwError(404, `${'Stark'} dynasty not found!`);
      player = new Player({
        name,
        dynasty: dynasty,
      });
      status = 201;
    }
    player.lastPlayed = new Date();
    player.gamesStarted++;
    const savedPlayer = await player.save();
    if (!savedPlayer) throwError(404, 'Created/updated player not saved!');

    const newGame = new Game({
      mode,
      difficulty,
      player: savedPlayer,
    });
    const startedGame = await newGame.save();
    if (!startedGame) throwError(404, 'Started game not saved!');

    res.status(status).json({
      message: 'New game started.',
      data: { gameId: startedGame._id },
    });
  } catch (err) {
    next(getCompleteError(err));
  }
};

exports.patchGameCancel = async (req, res) => {
  const { gameId } = req.params;
  try {
    const runningGame = await Game.findById(gameId);
    if (!runningGame) throwError(404, 'Running game not found!');
    runningGame.state = 'cancelled';
    const canceledGame = await runningGame.save();
    if (!canceledGame) throwError(404, 'Canceled game not saved!');

    res.status(200).json({
      message: 'Game canceled.',
    });
  } catch (err) {
    next(getCompleteError(err));
  }
};

exports.patchGameFinish = async (req, res, next) => {
  const { gameId } = req.params;
  const { whacks } = req.body;
  try {
    const runningGame = await Game.findById(gameId);
    if (!runningGame) throwError(404, 'Running game not found!');
    runningGame.state = 'finished';
    runningGame.whacks = whacks;
    runningGame.partialPoints = await Scoring.calculatePoints('easy', whacks);
    const finishedGame = await runningGame.save();
    if (!finishedGame) throwError(404, 'Finished game not saved!');
    res.status(200).json({
      message: 'Game finished.',
      data: { partialPoints: finishedGame.partialPoints },
    });
  } catch (error) {
    next(error);
  }
};

exports.patchSubmitScore = async (req, res, next) => {
  const { gameId } = req.params;
  try {
    const finishedGame = await Game.findById(gameId);
    if (!finishedGame) throwError(404, 'Finished game not found!');
    finishedGame.state = 'submitted';
    finishedGame.points = finishedGame.partialPoints;
    const submittedGame = await finishedGame.save();
    if (!submittedGame) throwError(404, 'Unable to save submitted game');
    res.status(200).json({
      message: 'Score submitted.',
    });
  } catch (err) {
    next(getCompleteError(err));
  }
};

exports.getLeaderboard = async (req, res, next) => {
  try {
    const topGames = await Game.find()
      .populate('player')
      .sort('-partialPoints')
      .limit(10); // TODO magic number
    if (!topGames) throwError(404, `Top ${10} results not found`);
    const leaderboard = topGames.map(game => ({
      playerName: game.player.name,
      mode: game.mode,
      difficulty: game.difficulty,
      points: game.partialPoints,
    }));
    res.status(200).json({
      message: 'Leaderboard retrieved.',
      data: { leaderboard },
    });
  } catch (err) {
    next(getCompleteError(err));
  }
};

function throwError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function getCompleteError(error) {
  if (!error.status) {
    error.status = 500;
  }
  return error;
}
