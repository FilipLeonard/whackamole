const Dynasty = require('../models/dynasty');
const Game = require('../models/game');
const Player = require('../models/player');

exports.getIndex = async (req, res, next) => {
  const completeDynasties = await Dynasty.find();
  const dynasties = completeDynasties.map(d => ({
    name: d.house,
    value: d.house,
  }));

  const completePlayers = await Player.find().populate('dynasty');
  const players = completePlayers.map(p => ({
    name: p.name,
    dynasty: p.dynasty.house,
  }));

  res.status(200).render('admin-index', {
    dynasties,
    players,
  });
};

exports.getGames = async (req, res, next) => {
  try {
    const { playerName } = req.params;
    const player = await Player.find({ name: playerName });
    if (!player) throwError(404, `Player ${playerName} not found!`);
    const completeGames = await Game.find({ player }).sort('-createdAt');
    if (!completeGames)
      throwError(404, `Games for player ${playerName} not found!`);
    const games = completeGames.map(g => ({
      state: g.state,
      whacks: g.whacks,
      partialPoints: g.partialPoints,
      points: g.points,
      createdAt: g.createdAt,
    }));
    console.log(games);
    res.status(200).json({
      message: `Games for ${playerName} retrieved.`,
      data: { games },
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
