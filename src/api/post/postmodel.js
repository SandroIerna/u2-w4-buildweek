import mongoose from "mongoose";
const { Schema, model } = mongoose;

const url = "https://i.stack.imgur.com/34AD2.jpg";
const postSchema = new Schema(
  {
    text: { type: String, required: true },
    description: { type: String, required: true },
    image: { default: url },
    user: [UserSchema],
    updatedAt: Date,
    createdAt: Date,
  },

  {
    timestamps: true,
  }
);

export default model("Product", postSchema);
