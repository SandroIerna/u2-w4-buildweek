import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import { config } from "dotenv";
import postRouter from "./api/post/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js"
import experiencesRouter from "./api/experiences/index.js";

const server = express();
const port = process.env.PORT;

// ****************************** MIDDLEWARES ******************************
server.use(cors());
server.use(express.json());

// ******************************* ENDPOINTS *******************************

server.use("/experiences", experiencesRouter);

server.use("/post", postRouter);
// ***************************** ERROR HANDLERS ****************************




server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
  console.log("Successfully connected to Mongo!");
});
