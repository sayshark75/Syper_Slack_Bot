const notesRouter = require("express").Router();
const { notesModel, listModel } = require("../Models/notes.model");

notesRouter.get("/", async (req, res) => {
  try {
    let data = await listModel.find({});
    res.status(200).send(data);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ msg: "Internal Server Error", error });
  }
});

notesRouter.get("/data", async (req, res) => {
  const { search } = req.query;
  try {
    let data = await notesModel.find({ title: search });
    res.status(200).send(data);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ msg: "Internal Server Error", error });
  }
});

notesRouter.post("/", async (req, res) => {
  const doc = req.body;
  try {
    let data = new notesModel(doc);
    await data.save();
    let heading = new listModel({ title: doc.title });
    await heading.save();
    res.status(200).send("Notes Added");
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ msg: "Internal Server Error", error });
  }
});

notesRouter.patch("/:title", async (req, res) => {
  const { title } = req.params;
  const doc = req.body;
  try {
    await notesModel.findOneAndUpdate({ title }, doc);
    res.status(200).send({ msg: "Notes Updated" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ msg: "Internal Server Error", error });
  }
});

notesRouter.delete("/:title", async (req, res) => {
  const { title } = req.params;
  try {
    await notesModel.findOneAndDelete({ title });
    await listModel.findOneAndDelete({ title });
    res.status(200).send({ msg: "Note Deleted" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ msg: "Internal Server Error", error });
  }
});

module.exports = notesRouter;
