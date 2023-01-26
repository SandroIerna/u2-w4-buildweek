import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import UsersModel from "../users/model.js";
import q2m from "query-to-mongo";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import json2csv from "json2csv";
import { pipeline, Readable } from "stream";

const experiencesRouter = express.Router();

//************************************ POST ************************************ */

experiencesRouter.post("/:userId/experiences", async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel(req.body);
    const { _id } = await newExperience.save();
    if (newExperience) {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { $push: { experiences: _id } },
        { new: true, runValidators: true }
      );
      if (updatedUser) {
        res.status(201).send(_id);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        );
      }
    } else {
      next(createHttpError(400, `Please add a valid Experience`));
    }
  } catch (error) {
    next(error);
  }
});

//*********************************** GET ALL ********************************** */

experiencesRouter.get("/:userId/experiences", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await ExperienceModel.countDocuments(mongoQuery.criteria);
    const user = await UsersModel.findById(req.params.userId)
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort)
      .populate({
        path: "experiences",
      });
    const experiences = user.experiences;
    res.send({
      links: mongoQuery.links("http://localhost:3001/experiences", total),
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      experiences,
    });
  } catch (error) {
    next(error);
  }
});

//********************************* GET SINGLE ********************************* */

experiencesRouter.get(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const experience = await ExperienceModel.findById(
        req.params.experienceId
      );
      if (experience) {
        res.send(experience);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//************************************ PUT ************************************* */

experiencesRouter.put(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        req.params.experienceId,
        req.body,
        { new: true, runValidators: true }
      );
      if (updatedExperience) {
        res.send(updatedExperience);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//*********************************** DELETE *********************************** */

experiencesRouter.delete(
  "/:userId/experiences/:experienceId",
  async (req, res, next) => {
    try {
      const deletedExperience = await ExperienceModel.findByIdAndDelete(
        req.params.experienceId
      );
      if (deletedExperience) {
        const user = await UsersModel.findByIdAndUpdate(
          req.params.userId,
          {
            $pull: { experiences: req.params.experienceId },
          },
          { new: true, runValidators: true }
        );
        if (user) {
          res.status(204).send();
        } else {
          next(
            createHttpError(404, `User with id ${req.params.userId} not found!`)
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//********************************** PUT IMAGE ********************************* */

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "U2-W4-BUILDWEEK" },
  }),
}).single("image");

experiencesRouter.post(
  "/:userId/experiences/:experienceId/image",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const url = req.file.path;
      const updatedExperience = await ExperienceModel.findByIdAndUpdate(
        req.params.experienceId,
        { image: url },
        { new: true, runValidators: true }
      );
      if (updatedExperience) {
        await updatedExperience.save();
        res.send(`File saved, file URL = ${url}`);
      } else {
        next(
          createHttpError(
            404,
            `Experience with id ${req.params.experienceId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

//********************************** CSV FILE ********************************** */

experiencesRouter.get(
  "/:userId/experiences/:experienceId/csv",
  async (req, res, next) => {
    try {
      res.setHeader(
        "Content-Dispostion",
        "attachment; filename=experience.csv"
      );
      const experience = await ExperienceModel.findById(
        req.params.experienceId
      );
      const source = new Readable({
        read(size) {
          this.push(JSON.stringify(experience));
          this.push(null);
        },
      });
      const transform = new json2csv.Transform({ fields: ["company", "role"] });
      const destination = res;

      pipeline(source, transform, destination, (err) => {
        if (err) console.log(err);
      });
    } catch (error) {
      next(error);
    }
  }
);

export default experiencesRouter;
