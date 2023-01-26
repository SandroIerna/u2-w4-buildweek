import mongoose from "mongoose";
const { Schema, model } = mongoose;

const url = "https://i.stack.imgur.com/34AD2.jpg";
const postSchema = new Schema(
  {
    text: { type: String, required: true },
    image: { type: String, default: url },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },

  {
    timestamps: true,
  }
);

export default model("Post", postSchema);
