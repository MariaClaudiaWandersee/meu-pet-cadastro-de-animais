const mongoose = require("mongoose");
const ROLES = require('./roles')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
  },
  role: {
    type: String,
    enum: [ROLES.ADMIN, ROLES.ATTENDANT],
    required: true,
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;