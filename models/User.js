const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  name:{type: String, required :true},
  balance: { type: Number, default: 10 },
  inventory:{type: Array},
  ability:{type: String, default:''}
});

const User = model('User', userSchema);

module.exports = User;
