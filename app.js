require("dotenv").config({ path: ".env.test" });
const connection = require("./db/connection");
const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("./controllers/users-controllers");
const { generateMultiplicationQuestions } = require("./utils/multiplication");
const endpoints = require("./endpoints.json");
const cors = require("cors");
const app = express();

app.use(cors());

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/users", getUsers);

app.get("/api/users/:user_id", getUserById);

app.post("/api/users", createUser);

app.patch("/api/users/:user_id", updateUser);

app.delete("/api/users/:user_id", deleteUser);
app.use((err, req, res, next) => {
  if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.use("*", (req, res, next) => {
  res.status(404).send({ message: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "bad request" });
  }
  if (err.code === "23502") {
    res.status(400).send({ message: "bad request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
});

app.get("/api/multiplication", (req, res) => {
  const questions = generateMultiplicationQuestions(25);
  res.json({ questions });
});

module.exports = app;
