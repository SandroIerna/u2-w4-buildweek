import express from "express";
import listEndpoints from "express-list-endpoints";
import postRouter from "./api/post";

const server = express();
const port = process.env.PORT;

// ****************************** MIDDLEWARES ******************************

// ******************************* ENDPOINTS *******************************
server.use("/post", postRouter);
// ***************************** ERROR HANDLERS ****************************

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
