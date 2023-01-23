import mongoose from "mongoose";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    bio: { type: String, required: false },
    title: { type: String, required: false },
    area: { type: String, required: false },
    image: {
      type: String,
      required: false,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    //TODO: GET IMG FROM CLOUDINARY
    username: { type: String, required: true },
    //TODO: ADD VALIDATION FOR THE UNIQUE USERNAME
    experiences: [],
    //TODO: EMBEDDING THE EXPERIENCE MODEL
    posts: [],
    //TODO: REFERENCING THE POSTS MODEL
  },
  {
    timestamps: true,
  }
);

export default model("User", usersSchema);
