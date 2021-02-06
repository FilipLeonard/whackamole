const { Schema, model } = require('mongoose');

const gameSchema = new Schema(
  {
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    mode: {
      type: String,
      enum: ['survival', 'battle'],
    },
    difficulty: {
      type: String,
      enum: ['easy', 'hard'],
    },
    state: {
      type: String,
      default: 'started',
      enum: ['started', 'cancelled', 'finished', 'submitted'],
    },
    whacks: {
      type: Number,
      default: 0,
    },
    partialPoints: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Game', gameSchema);
