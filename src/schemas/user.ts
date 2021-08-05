import mongoose, { Schema } from "mongoose";
import { accountSchema } from "./accounts";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accounts: [accountSchema],
});

export const User = mongoose.model("User", userSchema);
