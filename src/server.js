import express from "express";
import listEndpoints from "express-list-endpoints";

const server = express();
const port = process.env.PORT;

// ****************************** MIDDLEWARES ******************************

// ******************************* ENDPOINTS *******************************

// ***************************** ERROR HANDLERS ****************************

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});
