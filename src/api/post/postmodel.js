import mongoose from "mongoose";
const { Schema, model } = mongoose;

const url = "https://i.stack.imgur.com/34AD2.jpg";
const postSchema = new Schema(
  {
    text: { type: String, required: false },
    username: { type: String, default: "admin" },
    image: { type: String, default: url },
    user: { type: String, default: "63ce761ecf41be127c317e0e" },
    updatedAt: Date,
    createdAt: Date,
  },

  {
    timestamps: true,
  }
);

export default model("Post", postSchema);
