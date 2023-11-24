import path from "path";
import { orderBy } from "lodash";
import { config } from "../../../../../config";
import { createAppModule, listFilesByExtensions } from "../../utils";
import installSwitchGame from "./utils";

const dirs = config.roms_dir;

export default createAppModule("roms", (instance) => {
  instance.get("/list", async () => {
    const roms = await listFilesByExtensions(dirs, ["nsp", "nsz", "xci"]);
    return orderBy(roms, (filePath) => path.basename(filePath));
  });

  instance.post<{ Body: { ip: string; paths: string[] } }>(
    "/install",
    (req, res) => {
      return installSwitchGame(req.body.ip, req.body.paths)(req, res);
    }
  );
});
