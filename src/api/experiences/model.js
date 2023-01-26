import mongoose, { model } from "mongoose";

const { Schema } = mongoose;

const experienceSchema = new Schema(
  {
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    description: { type: String, required: true },
    area: { type: String, required: true },
    image: { type: String, default: "http://placekitten.com/g/300/300" },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

export default model("Experience", experienceSchema);
