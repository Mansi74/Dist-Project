import mongoose from "mongoose";





//const { Schema, model, default: mongoose } = require("mongoose");

const Document = new mongoose.Schema({
  _id: String,
  data: Object,
});

const document = mongoose.model('Document', Document);

export default document;
