import express from "express";
import PostModel from "./postmodel.js";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";

const postRouter = express.Router();

postRouter.post("/", async (req, res, next) => {
  try {
    const userId = req.body.user;
    console.log("here i am", userId);
    const post = new PostModel(req.body);
    const { _id } = await post.save();
    // const updatedUser = await UsersModel.findByIdAndUpdate(
    //   userId,
    //   { $push: { post: _id } },
    //   { new: true, runValidators: true }
    // );

    res.status(201).send({
      message: `post with ${_id} created abd user with ${userId} updated!,
      updatedUser: updatedUser`,
    });
  } catch (error) {
    next(error);
  }
});
postRouter.get("/", async (req, res, next) => {
  try {
    const post = await PostModel.find();
    res.send(post);
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await PostModel.findById(req.params.postId);
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
