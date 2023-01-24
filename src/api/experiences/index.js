import express from "express";
import createHttpError from "http-errors";
import ExperienceModel from "./model.js";
import q2m from "query-to-mongo";
import fs from "fs-extra";
import json2csv from "json2csv";
import { pipeline } from "stream";

const { createReadStream } = fs;

const experiencesRouter = express.Router();

//************************************ POST ************************************ */

experiencesRouter.post("/", async (req, res, next) => {
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

//********************************** CSV FILE ********************************** */

/* experiencesRouter.get("/:experienceId/csv", async (req, res, next) => {
  try {
    const cursor = ExperienceModel.find()
      .cursor()
      .on("data", (doc) => doc);
    console.log("------------------", cursor);
    const transform = new json2csv.Transform({ fields: ["company"] });
    const destination = res;
    pipeline(cursor, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
 */
export default experiencesRouter;
