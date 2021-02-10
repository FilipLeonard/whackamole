const { Schema, model } = require('mongoose');

const scoringSchema = new Schema({
  difficulty: {
    type: String,
    unique: true,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy',
  },
  thresholds: {
    type: [
      {
        _id: false,
        floor: Number,
        ceil: Number,
        whackPowerIndex: Number,
      },
    ],
    default: [
      {
        floor: 1,
        ceil: 5,
        whackPowerIndex: 50,
      },
      {
        floor: 6,
        ceil: 19,
        whackPowerIndex: 60,
      },
      {
        floor: 20,
        ceil: 29,
        whackPowerIndex: 65,
      },
      {
        floor: 30,
        ceil: 39,
        whackPowerIndex: 67,
      },
      {
        floor: 40,
        ceil: 49,
        whackPowerIndex: 68,
      },
      {
        floor: 50,
        ceil: 59,
        whackPowerIndex: 69,
      },
      {
        floor: 60,
        ceil: 69,
        whackPowerIndex: 70,
      },
      {
        floor: 70,
        ceil: 79,
        whackPowerIndex: 71,
      },
      {
        floor: 80,
        ceil: 99,
        whackPowerIndex: 72,
      },
      {
        floor: 100,
        ceil: 999,
        whackPowerIndex: 73,
      },
    ],
  },
});

scoringSchema.statics.calculatePoints = async function (difficulty, whacks) {
  let finalPoints = 0;
  if (whacks > 0) {
    const { thresholds } = await this.findOne({ difficulty });
    const th = thresholds.find(t => t.floor <= whacks && whacks <= t.ceil);
    finalPoints = whacks * this.getWhackValue(th.whackPowerIndex);
  }
  return finalPoints;
};

scoringSchema.statics.getWhackValue = function (whackPowerIndex) {
  return (100 - whackPowerIndex) * 1000;
};

module.exports = model('Scoring', scoringSchema);
