import mongoose from "mongoose";
import { Schema } from "mongoose";

// Schema for storing CSV files as buffers
const FileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  file: {
    type: Buffer,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const datasetModel = mongoose.model('dataset', FileSchema);

export default datasetModel;
