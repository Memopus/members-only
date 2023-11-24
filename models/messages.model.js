const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, minLength: 2, required: true },
  content: { type: String, minLength: 2, required: true },
  author: { type: Schema.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("url").get(function () {
  return "/messages/" + this._id;
});

module.exports = mongoose.model("Message", MessageSchema);
