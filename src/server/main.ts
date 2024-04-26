import cors from "cors";
import express from "express";
import ViteExpress from "vite-express";
import { config } from "../../config";
import titleDB from "./titleDB";
import router from "./router";
import { pinoHttp } from "./utils";

await titleDB.setup();

const port = config.port;
const app = express();

app.use(cors());
app.use(pinoHttp);
app.use("/api", router);

ViteExpress.listen(app, port, () =>
  console.log("Server is listening on port", port)
);
