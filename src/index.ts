import path from "path";
import express from "express";
import cors from "cors";
import { orderBy } from "lodash";
import { config } from "../config";
import { getTitleId, pinoHttp } from "./utils";
import { listFilesByExtensions } from "./utils";
import titleDB from "./titleDB";

await titleDB.setup();

const host = "0.0.0.0";
const port = config.port;

const app = express();
app.use(cors());
app.use(pinoHttp);

function renderFiles(files: any[]) {
  return files
    .map((file) => {
      return `<a href="${encodeURI(file.name)}">${
        file.name
      }</a>      17-Nov-2023 15:43          ${file.size}`;
    })
    .join("\n");
}

function renderGames(games: any[]) {
  return games
    .map((game) => {
      return `<a href="${game.id}/">${game.title}/</a>`;
    })
    .join("\n");
}

async function getGames(gameId?: string) {
  const files = await listFilesByExtensions(config.dirs, ["nsp", "nsz", "xci"]);

  return files.reduce(
    (acc, { path: filePath, size }) => {
      const fileName = path.basename(filePath);
      const game = titleDB.find(getTitleId(fileName) || "others");

      if (gameId && game.id !== gameId) {
        return acc;
      }

      if (!acc[game.id]) {
        acc[game.id] = {
          id: game.id,
          title: game.name.replace(/[^a-zA-Z0-9 ]/g, ""),
          files: [],
        };
      }

      acc[game.id].files.push({
        name: fileName,
        path: filePath,
        size,
      });

      return acc;
    },
    {} as Record<
      string,
      {
        id: string;
        title: string;
        files: { name: string; path: string; size: number }[];
      }
    >
  );
}

app.get("/:gameId?", async (req, res) => {
  const selectedGameId = req.params.gameId;
  const selectedGame = selectedGameId && titleDB.find(selectedGameId);

  if (selectedGameId && !selectedGame) {
    res.sendStatus(404);
    return;
  }

  const games = await getGames(selectedGameId);

  const ordered = orderBy(Object.values(games), "title").map((it) => ({
    ...it,
    files: orderBy(it.files, "name"),
  }));

  const html = `
    <html>
      <head>
        <title>${selectedGame ? selectedGame.name : "Roms"}</title>
      </head>
      <body>
        <h1>${selectedGame ? selectedGame.name : "Roms"}</h1>
        <hr />
        <pre>
${
  selectedGame
    ? `<a href="../">../</a>\n${renderFiles(ordered[0].files)}`
    : renderGames(ordered)
}
        </pre>
        <hr />
      </body>
    </html>
  `;

  res.setHeader("content-type", "text/html");
  res.send(html);
});

app.all("/:gameId/:fileName", async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    return res.sendStatus(404);
  }

  const game = (await getGames())[req.params.gameId];

  if (!game) {
    return res.sendStatus(404);
  }

  const file = game.files.find((file) => file.name === req.params.fileName);

  if (!file) {
    return res.sendStatus(404);
  }

  return res.sendFile(file.path);
});

app.listen(port, host, () => {
  console.log(`Listening at http://${host}:${port}`);
});
