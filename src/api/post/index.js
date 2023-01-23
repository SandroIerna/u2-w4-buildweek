import express from "express";

const postRouter = express();

postRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
postRouter.get("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
postRouter.get("/:postId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
postRouter.put("/:postId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
postRouter.delete("/:postId", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default postRouter;
