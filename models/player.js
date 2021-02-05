const { Schema, model } = require('mongoose');

const playerSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dynasty: {
      type: Schema.Types.ObjectId,
      ref: 'Dynasty',
    },
    gamesStarted: {
      type: Number,
      default: 0,
    },
    gamesFinished: {
      type: Number,
      default: 0,
    },
    lastPlayed: {
      type: Schema.Types.Date,
    },
    highScore: {
      type: Schema.Types.ObjectId,
      ref: 'Game',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Player', playerSchema);
