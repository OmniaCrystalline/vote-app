/** @format */
require("dotenv").config();
var express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const { Joke, UserVote } = require("./models");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const { MONGO_URL, KEY_JWT, SALT } = process.env;

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

app.get("/joke", async (req, res) => {
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

app.post("/joke/:id", async (req, res) => {
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

app.put("/joke/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const el = await Joke.findByIdAndUpdate(id, req.body, { new: true });
    return res.json(el);
  } catch (error) {
    console.error(error.message);
    res.json({ message: error.message });
  }
});

app.delete("/joke/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Joke.findByIdAndDelete(id);
    return res.json({ message: "Joke deleted" });
  } catch (error) {
    console.error(error.message);
    res.json({ message: error.message });
  }
});

app.post("/signup", async (req, res) => {
  const { name, pass, email } = req.body;
  //lookup in base
  try {
    const inBD = await UserVote.findOne({ email });
    if (inBD)
      res
        .status(500)
        .json({ message: "User with this email already exist, login!" });
  } catch (error) {
    console.error(error.message);
    res.json({ message: error.message });
  }
  //create user
  bcrypt.hash(pass, 10, async function (err, hash) {
    if (hash) {
      const token = jwt.sign(
        {
          data: email,
        },
        KEY_JWT,
        { expiresIn: "1h" }
      );
      const newUser = await UserVote.create({
        name,
        email,
        pass: hash,
        token,
      });
      if (newUser) return res.json(newUser);
      else
        res.status(500).json({ message: "error with saving user, try again" });
    } else res.json({ message: err.message });
  });
});

app.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await UserVote.findOne({ email });
  if (!user) res.status(400).json({ message: "User not found, register, plz" });
  else {
    const passOK = bcrypt.compareSync(pass, user.pass);
    if (passOK) {
      const token = jwt.sign(
        {
          data: email,
        },
        KEY_JWT,
        { expiresIn: "1h" }
      );
      const updatedUser = await UserVote.findByIdAndUpdate(
        user._id,
        { token },
        { new: true }
      );
      if (updatedUser) res.json(updatedUser);
      else res.status(500).json({ message: "error token refresh" });
    }
  }
});

app.get("/results", async (req, res) => {
  const data = await Joke.find({
    votes: { $elemMatch: { value: { $gt: 0 } } },
  });
  console.log(data)
  if (data) res.json(data);
  else res.status(500).json({ message: data.message });
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
