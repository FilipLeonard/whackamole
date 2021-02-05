const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.get('/', gameController.getIndex);

router.put('/game-start', gameController.putGameStart);

router.patch('/game-cancel/:gameId', gameController.patchGameCancel);

module.exports = router;
