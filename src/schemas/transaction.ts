import mongoose, { Schema } from "mongoose";

export const transactionSchema = new Schema({
  transactionDate: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
