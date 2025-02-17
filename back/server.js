/** @format */
require("dotenv").config();
var express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const Joke = require("./models");
const bodyParser = require("body-parser");

const availableVotes = ["😂", "👍", "❤️"];

const { MONGO_URL } = process.env;

async function main() {
  try {
    if (!MONGO_URL) {
      throw new Error("HOST_DB not set!");
    }
    await mongoose.connect(MONGO_URL);
    console.log("Database connection successful");
    app.listen(4000, (err) => {
      if (err) throw err;
      console.log(`server is listening on port: ${4000}`);
    });
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
main();

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/api/joke", async (req, res) => {
  try {
    const r = await fetch(process.env.JOKE_API_URL).then((r) => r.json());
    const indb = await Joke.findOne({ question: r.question });
    if (!indb) {
      const newdbelem = await Joke.create({
        question: r.question,
        answer: r.answer,
      });
      return res.json(newdbelem);
    } else {
      return res.json(indb);
    }
  } catch (error) {
    res.json({ message: error.message + "get" });
  }
});

app.post("/api/joke/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const el = await Joke.findByIdAndUpdate(
      id,
      { votes: req.body },
      { new: true }
    );
    return res.json(el);
  } catch (error) {
    console.error(error.message + "post");
    res.json({ message: error.message });
  }
});

app.put("/api/joke/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const el = await Joke.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(el);
  } catch (error) {
    console.error(error.message);
    res.json({ message: error.message });
  }
});

app.delete("/api/joke/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Joke.findByIdAndDelete(id);
    return res.json({ message: "Joke deleted" });
  } catch (error) {
    console.error(error.message + "post");
    res.json({ message: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
