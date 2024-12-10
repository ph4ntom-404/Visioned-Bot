const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  streak:{type: Number, default:0},
  lastUsed :{type: Date}
});

const User = model('cooldowns', userSchema);

module.exports = User;
