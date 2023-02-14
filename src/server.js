import express from "express";
import cors from "cors";
import productsRouter from "./api/products/index.js";
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundErrorHandler,
} from "./errorHandlers.js";

const server = express();

// ************************************* MIDDLEWARES *******************************
server.use(cors());
server.use(express.json());

// *************************************** ENDPOINTS *******************************
server.use("/products", productsRouter);

/* server.get("/test", (req, res, next) => {
  try {
    res.send({ message: "Test successfull" })
  } catch (error) {
    console.log(error)
  }
}) */

// ************************************ ERROR HANDLERS *****************************
server.use(badRequestHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

export default server;
