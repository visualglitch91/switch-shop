import path from "path";
import express from "express";
import cors from "cors";
import { orderBy } from "lodash";
import { config } from "../config";
import { formatDate, getTitleId, pinoHttp } from "./utils";
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
      }</a>      ${formatDate(file.lastModified)}          ${file.size}`;
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

async function getGames(filterId?: string) {
  const files = await listFilesByExtensions(config.dirs, ["nsp", "nsz", "xci"]);

  return files.reduce(
    (acc, { path: filePath, size }) => {
      const fileName = path.basename(filePath);
      const game = titleDB.find(getTitleId(fileName) || "others");
      const gameId = game.id !== "others" ? game.id.slice(0, -4) : game.id;

      if (filterId && gameId !== filterId) {
        return acc;
      }

      if (!acc[gameId]) {
        acc[gameId] = {
          id: gameId,
          title: game.name.replace(/[^a-zA-Z0-9 ]/g, ""),
          image: game.iconUrl,
          files: [],
        };
      }

      acc[gameId].files.push({
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
        image?: string;
        files: { name: string; path: string; size: number }[];
      }
    >
  );
}

app.get("/favicon.ico", (_, res) => {
  return res.sendStatus(404);
});

app.get("/json", async (_, res) => {
  const games = await getGames();

  const ordered = orderBy(Object.values(games), "title").map((it) => ({
    ...it,
    files: orderBy(it.files, "name"),
  }));

  if (ordered.length === 0) {
    return res.sendStatus(404);
  }

  return res.send(ordered);
});

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

  if (ordered.length === 0) {
    return res.sendStatus(404);
  }

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
