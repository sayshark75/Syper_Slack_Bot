require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./Connection/ConnectDB");
const notesRouter = require("./Routes/notes.routes");

const port = process.env["port"];

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.text());

app.get("/", (req, res) => {
  res.status(200).send({
    msg: "Home Page",
  });
});

app.use("/notes", notesRouter);

app.listen(port, async () => {
  try {
    await connectDB;
    console.log("Connected to DB");
  } catch (error) {
    console.log("error: ", error);
  }
  console.log(`Server Running on Port ${port}`);
});
