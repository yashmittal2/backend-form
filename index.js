import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const server = express();
server.use(cors());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
  continent: String,
  location: String,
});
const Covid = mongoose.model("covid", userSchema);

server.post("/search", async (req, res) => {
  console.log(req.body);
  const doc = await Covid.find({
    continent: req.body.continent,
    location: req.body.location,
  });
  res.send(doc);
});
server.get("/data", async (req, res) => {
  try {
    const allData = await Covid.find();
    res.send(allData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

await mongoose.connect("mongodb://localhost:27017/COVID19");
console.log("db connected");

server.listen(8080, () => {
  console.log("server started");
});
