const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  name:{type: String, required :true},
  level: { type: Number, default: 0 },
  xp:{type:Number, default:1},
  msgs:{type:Number,default:1},
  goal:{type: Number, default:50}

});

const User = model('level', userSchema);

module.exports = User;
