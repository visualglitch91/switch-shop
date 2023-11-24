import fs from "fs";
import path from "path";
import pino, { HttpLogger } from "pino-http";

export function getTitleId(name: string) {
  const regex = /0100[0-9A-Z]{3}0[0-9A-Z]{4}/; // Updated regex pattern
  const match = name.match(regex); // Use match to find the pattern

  if (match) {
    return match[0]; // Return the matched pattern
  } else {
    return null; // Return null if pattern not found
  }
}

export async function listFilesByExtensions(
  directoryPaths: string[],
  fileExtensions: string[]
) {
  let files: { path: string; size: number }[] = [];

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
          files.push({ path: itemPath, size: stats.size });
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
