import axios from "axios";
import { keyBy } from "lodash";
import { config } from "../config";

let database: Record<string, { id: string; name: string }>;

async function update() {
  console.log("Updating title database...");

  await axios
    .get<{ id: string; name: string }[]>(
      "https://raw.githubusercontent.com/blawar/titledb/master/US.en.json"
    )
    .then(({ data }) => {
      database = keyBy(
        Object.values(data).filter(({ id }) => id && id.endsWith("000")),
        ({ id }) => id.slice(0, -4)
      );
    });

  setTimeout(update, 60 * 60_000);
}

function find(titleId: string): { id: string; name: string; iconUrl?: string } {
  return database[titleId] || { id: "others", name: "Others" };
}

const titleDB = {
  setup: update,
  find,
};

export default titleDB;
