import express from "express";
import createHttpError from "http-errors";
import UsersModel from "./model.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const usersRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "bw4/profile-images",
    },
  }),
}).single("image");

//Registers a new user with all his details
usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

//Retrieves list of users
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UsersModel.find();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

//Retrieves the user with userId
usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);

    if (user) {
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//Update current user profile details
usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(
      req.params.userId,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (user) {
      await user.save();
      res.send(user);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UsersModel.findByIdAndDelete(req.params.userId);

    if (deletedUser) {
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//Replace user profile picture (name = profile)
usersRouter.post(
  "/:userId/picture",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;

      console.log("hgasjsdfhs", url);
      const oldUser = await UsersModel.findById(req.params.userId);

      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $set: { image: url } },
        { new: true, runValidators: true }
      );

      if (updatedUser) {
        await updatedUser.save();
        res.send("file uploaded");
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//Generates and download a PDF with the CV of the user (details, picture, experiences)
usersRouter.get("/:userId/CV", async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
