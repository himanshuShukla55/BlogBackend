const { Schema, model } = require("mongoose");

//* declaring user schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"], required: true },
  country: { type: String, required: true },
});

//* creating user model
const UserModel = model("user", UserSchema);

module.exports = { UserModel };
