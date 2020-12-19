const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["buyer", "farmer", "admin", "courier"]
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);
