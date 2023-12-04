const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, minLength: 2, required: true },
  lastName: { type: String, minLength: 2, required: true },
  email: { type: String, minLength: 5, required: true },
  password: { type: String, minLength: 5, required: true },
  isAdmin: { type: Boolean },
  isMember : {type :Boolean}
});

UserSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});

UserSchema.virtual("url").get(function () {
  return "/users/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);
