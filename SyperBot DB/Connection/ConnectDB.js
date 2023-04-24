const mongoose = require("mongoose");
require("dotenv").config();

const MongoURL = process.env["MONGO_URL"];

const connectDB = mongoose.connect(MongoURL);

module.exports = connectDB;
