const { Schema, model } = require('mongoose');

const dynastySchema = new Schema({
  house: {
    type: String,
    unique: true,
    enum: [
      'Arryn',
      'Baratheon',
      'Bronn',
      'Greyjoy',
      'Lannister',
      'Martell',
      'Stark',
      'Targaryen',
      'Tyrell',
      'Tully',
    ],
    default: 'Stark',
  },
  sigil: {
    type: String,
    default: 'A grey direwolf on a white field',
  },
  head: {
    type: String,
    default: 'Queen Sansa Stark',
  },
  heir: {
    type: String,
    default: 'Princess Arya Stark',
  },
  seat: {
    type: String,
    default: 'Winterfell',
  },
  army: {},
});

module.exports = model('Dynasty', dynastySchema);
