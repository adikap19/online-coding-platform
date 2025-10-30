import express from "express";
import cors from "cors";
import routes from "./routes/codeBlock.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp({ clientOrigin }) {
  const app = express();
  app.use(cors({ origin: clientOrigin, credentials: true }));
  app.use(express.json());

  app.get("/", (_, res) => res.send("Server is up"));
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
