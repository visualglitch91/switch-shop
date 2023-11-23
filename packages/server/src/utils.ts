import fs from "fs";
import path from "path";
import ObjectID from "bson-objectid";
import { spawn } from "child_process";
import { Request, Response, Router } from "express";
import pino, { HttpLogger } from "pino-http";
import { Socket } from "socket.io";

export async function listFilesByExtensions(
  directoryPaths: string[],
  fileExtensions: string[]
): Promise<string[]> {
  let files: string[] = [];

  async function processDirectory(directoryPath: string) {
    const directoryContents = await fs.promises.readdir(directoryPath);

    for (const item of directoryContents) {
      const itemPath = path.join(directoryPath, item);
      const stats = await fs.promises.lstat(itemPath);

      if (stats.isDirectory()) {
        await processDirectory(itemPath); // Recursively process subdirectories
      } else {
        const fileExtension = path.extname(item).toLowerCase().substring(1);

        if (fileExtensions.includes(fileExtension)) {
          files.push(itemPath);
        }
      }
    }
  }

  // Process each directory asynchronously
  await Promise.all(
    directoryPaths.map(async (dirPath) => {
      await processDirectory(dirPath);
    })
  );

  return files;
}

export function createProccessOutputStreamer(cmd: string, params: string[]) {
  return async function streamProcessOutput(
    request: Request<any, any, any, any>,
    response: Response
  ) {
    const child = spawn(cmd, params);
    const processId = String(ObjectID());
    const { io, session } = request;
    const room = io.to(session.id);
    let ended = false;

    const socketsInRoom = (await room.fetchSockets()).reduce((acc, { id }) => {
      const socket = io.sockets.sockets.get(id);
      return socket ? [...acc, socket] : acc;
    }, [] as Socket[]);

    const end = () => {
      if (ended) {
        return;
      }

      request.log.info(
        `streaming ended for process ${processId} and session ${session.id} [${[
          cmd,
          ...params,
        ].join(" ")}]`
      );

      socketsInRoom.forEach((socket) => {
        socket.off(`process-output:kill:${processId}`, end);
        socket.off("disconnect", end);
      });

      try {
        child.kill();
      } catch (_) {}
    };

    const emitLog = (message: string) => {
      logger.debug(`[process-output:log:${processId}]: ${message}`);
      room.emit(`process-output:log:${processId}`, message);
    };

    request.log.info(
      `streaming started for process ${processId} and session ${session.id} [${[
        cmd,
        ...params,
      ].join(" ")}]`
    );

    socketsInRoom.forEach((socket) => {
      socket.on(`process-output:kill:${processId}`, end);
      socket.on("disconnect", end);
    });

    child.stdout.on("data", (data) => emitLog(data.toString()));
    child.stderr.on("data", (data) => emitLog(data.toString()));
    child.on("close", end);

    response.send({ processId });
  };
}

function createAppModuleInstance(router: Router) {
  function createMethod(
    method: "get" | "post" | "patch" | "put" | "delete" | "head"
  ) {
    return function defineRoute<
      Config extends {
        Params?: object;
        Body?: object;
        Query?: object;
        Response?: object;
      }
    >(
      path: string,
      handler: (
        req: Request<
          Config["Params"],
          Config["Response"],
          Config["Body"],
          Config["Query"]
        >,
        res: Response<Config["Response"]>
      ) => Promise<Config["Response"]> | undefined | void
    ) {
      router[method](
        path,
        (
          req: Request<
            Config["Params"],
            Config["Response"],
            Config["Body"],
            Config["Query"]
          >,
          res: Response<Config["Response"]>
        ) => {
          const result = handler(req, res);

          if (typeof result === "undefined") {
            return;
          }

          result.then(
            (result) => res.send(result),
            (error) => res.status(500).send({ error } as any)
          );
        }
      );
    };
  }

  return {
    router,
    get: createMethod("get"),
    post: createMethod("post"),
    patch: createMethod("patch"),
    put: createMethod("put"),
    delete: createMethod("delete"),
    head: createMethod("head"),
  };
}

type AppModuleInstance = ReturnType<typeof createAppModuleInstance>;

const pinoHttp = pino({
  level: "warn",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "HH:MM:ss",
      ignore: "pid,hostname,req.headers.authorization",
    },
  },
});

export { pinoHttp };

export const logger = pinoHttp.logger;

export type Logger = HttpLogger["logger"];

export function createAppModule(
  name: string,
  defineAppModule: (instance: AppModuleInstance, logger: Logger) => void
) {
  const router = Router();

  return {
    name,
    setup: async () => {
      await defineAppModule(
        createAppModuleInstance(router),
        logger.child({ module: name })
      );
      return router;
    },
  };
}
