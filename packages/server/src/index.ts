import path from "path";
import http from "http";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import { config } from "../../../config";
import { pinoHttp } from "./utils";
import io from "./io";

const isDev = process.env.NODE_ENV === "development";
const host = "0.0.0.0";
const port = isDev ? config.development_server_port : config.port;

console.log({ isDev, port });

const app = express();
const server = http.createServer(app);
const clientDir = path.resolve(__dirname + "/../../../dist");

const sessionMiddleware = session({
  secret: String(Date.now()),
  resave: true,
  saveUninitialized: true,
});

app.use(cors());
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(pinoHttp);
app.use(io(server, sessionMiddleware));

if (!isDev) {
  app.use(express.static(clientDir));
}

const modules = import.meta.glob("./modules/*/index.ts", { eager: true });

for (let key in modules) {
  //@ts-ignore
  const { default: mod } = modules[key];
  app.use(`/api/${mod.name}`, await mod.setup());
  console.log(`module loaded: ${mod.name}`);
}

app.get("/*", (_, res) => {
  res.sendFile(clientDir + "/index.html");
});

server.listen({ host, port }, () => {
  console.log(`Server listening at ${host}:${port}`);
});
