import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import { config } from "dotenv";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import experiencesRouter from "./api/experiences/index.js";
import usersRouter from "./api/users/index.js";

const server = express();
const port = process.env.PORT;

// ****************************** MIDDLEWARES ******************************

server.use(cors());
server.use(express.json());

mongoose.set("strictQuery", false);

// ******************************* ENDPOINTS *******************************
server.use("/users", usersRouter);

server.use("/experiences", experiencesRouter);

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
});
