import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import q2m from "query-to-mongo";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import json2csv from "json2csv";
import { pipeline, Readable } from "stream";

const experiencesRouter = express.Router();

//************************************ POST ************************************ */

experiencesRouter.post("/:userId", async (req, res, next) => {
  try {
    const newExperience = new ExperienceModel(req.body);
    const { _id } = await newExperience.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

//*********************************** GET ALL ********************************** */

experiencesRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const total = await ExperienceModel.countDocuments(mongoQuery.criteria);
    const experiences = await ExperienceModel.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .limit(mongoQuery.options.limit)
      .skip(mongoQuery.options.skip)
      .sort(mongoQuery.options.sort);
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

experiencesRouter.get("/:experienceId", async (req, res, next) => {
  try {
    const experience = await ExperienceModel.findById(req.params.experienceId);
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
});

//************************************ PUT ************************************* */

experiencesRouter.put("/:experienceId", async (req, res, next) => {
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
});

//*********************************** DELETE *********************************** */

experiencesRouter.delete("/:experienceId", async (req, res, next) => {
  try {
    const deletedExperience = await ExperienceModel.findByIdAndDelete(
      req.params.experienceId
    );
    if (deletedExperience) {
      res.status(204).send();
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
});

//********************************** PUT IMAGE ********************************* */

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: { folder: "U2-W4-BUILDWEEK" },
  }),
}).single("image");

experiencesRouter.post(
  "/:experienceId/image",
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

experiencesRouter.get("/:experienceId/csv", async (req, res, next) => {
  try {
    res.setHeader("Content-Dispostion", "attachment; filename=experiences.csv");
    const experiences = await ExperienceModel.find();
    const source = new Readable({
      read(size) {
        this.push(JSON.stringify(experiences));
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
});

export default experiencesRouter;
