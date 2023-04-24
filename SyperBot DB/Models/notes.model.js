const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
  title: String,
  message: String,
  date: String,
});

const notesModel = mongoose.model("notes", notesSchema);

const listSchema = mongoose.Schema({
  title: String,
});

const listModel = mongoose.model("lists", listSchema);

module.exports = { notesModel, listModel };
