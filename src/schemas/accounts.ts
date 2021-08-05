import mongoose, { Schema } from "mongoose";
import { transactionSchema } from "./transaction";

export const accountSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  accountNumber: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  reportingCurrency: {
    type: String,
    required: true,
  },
  reportingBalance: {
    type: Number,
    required: true,
  },
  transaction: [transactionSchema],
});

export const Account = mongoose.model("Account", accountSchema);
