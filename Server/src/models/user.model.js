import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  name: {
    type: String,
    required: true,
    minlength: [3, "Please enter full name"],
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: [8, "Password mut be at least 8 characters"],
  },
  refreshToken: {
    type: String,
  },
});
