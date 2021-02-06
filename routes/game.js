const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.get('/', gameController.getIndex);

router.get('/leaderboard', gameController.getLeaderboard);

router.put('/game-start', gameController.putGameStart);

router.patch('/game-cancel/:gameId', gameController.patchGameCancel);

router.patch('/game-finish/:gameId', gameController.patchGameFinish);

router.patch('/submit-score/:gameId', gameController.patchSubmitScore);

module.exports = router;
