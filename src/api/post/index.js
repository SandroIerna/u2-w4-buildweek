import express from "express";
import PostModel from "./postmodel.js";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import q2m from "query-to-mongo";
import UsersModel from "../users/model.js";

const postRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "fs0432/linkedin",
    },
  }),
}).single("image");

postRouter.post("/:postId", cloudinaryUploader, async (req, res, next) => {
  try {
    const url = req.file.path;
    console.log("post image here", url);

    const posts = await PostModel.findById(req.params.postId);
    console.log("list of post", posts);

    const updatePost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      { image: url },
      { new: true, runValidators: true }
    );
    if (updatePost) {
      res.send("Post image uploaded");
    }
  } catch (error) {
    next(error);
  }
});

postRouter.post("/", async (req, res, next) => {
  try {
    const userId = req.body.user;
    const post = new PostModel(req.body);
    const { _id } = await post.save();
    const updatedUser = await UsersModel.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      const { _id } = await post.save();

      res.status(201).send({
        message: `Post with ID: ${_id} created and user.posts with ID: ${userId} updated!`,
        post: post,
      });
    } else {
      next(createHttpError(404, `User with id ${userId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});
postRouter.get("/", async (req, res, next) => {
  try {
    const post = await PostModel.find().populate({
      path: "user",
      select: "name surname username _id",
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId).populate({
      path: "user",
      select: "name surname username _id",
    });
    if (post) {
      res.send(post);
    }
  } catch (error) {
    next(createHttpError(404, `post ${req.params.postId} not found.`));
  }
});
postRouter.put("/:postId", async (req, res, next) => {
  try {
    const updatePost = await PostModel.findByIdAndUpdate(
      req.params.postId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatePost) {
      res.send(updatePost);
    } else {
      next(createHttpError(404, `postId ${req.params.postId} not found.`));
    }
  } catch (error) {
    next(error);
  }
});
postRouter.delete("/:postId", async (req, res, next) => {
  try {
    const deletPost = await PostModel.findByIdAndDelete(req.params.postId);
    if (deletPost) {
      res.status(204).send(`this post as being deleted sucessfully`);
    } else {
      createHttpError(404, `postId ${req.params.postId} not found.`);
    }
  } catch (error) {
    next(error);
  }
});

export default postRouter;
