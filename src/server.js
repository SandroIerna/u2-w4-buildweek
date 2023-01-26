import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { config } from "dotenv";
import postRouter from "./api/post/index.js";
import {
  badRequestHandler,
  conflictErrorHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import experiencesRouter from "./api/experiences/index.js";
import usersRouter from "./api/users/index.js";
import createHttpError from "http-errors";

const server = express();
const port = process.env.PORT;

const whitelist = [
  process.env.FE_PROD_URL,
  process.env.MONGO_URL,
  process.env.CLOUDINARY_URL,
];

const corsOpts = {
  origin: (origin, corsNext) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      corsNext(null, true);
    } else {
      corsNext(
        createHttpError(400, `Origin ${origin} is not in the whitelist!`)
      );
    }
  },
};

// ****************************** MIDDLEWARES ******************************

server.use(cors(corsOpts));
server.use(express.json());

/* mongoose.set("strictQuery", false); */

// ******************************* ENDPOINTS *******************************

server.use("/users", usersRouter);
server.use("/users", experiencesRouter);
server.use("/post", postRouter);

// ***************************** ERROR HANDLERS ****************************

server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(conflictErrorHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});
