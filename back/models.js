/** @format */

const mongoose = require("mongoose");

const reactions = ["😂", "👍", "❤️"];

const VotesSchema = new mongoose.Schema({
  label: String,
  value: Number,
});

const JokeSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  votes: {
    type: [VotesSchema],
    default: [
      { label: "😂", value: 0 },
      { label: "👍", value: 0 },
      { label: "❤️", value: 0 },
    ],
  },
  availableVotes: { type: [String], default: reactions },
});

const Joke = mongoose.model("Joke", JokeSchema);

module.exports = Joke;
