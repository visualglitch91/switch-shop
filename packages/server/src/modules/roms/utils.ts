import { createProccessOutputStreamer } from "../../utils";

export default function installSwitchGame(ip: string, paths: string[]) {
  return createProccessOutputStreamer("/usr/bin/java", [
    "-jar",
    `${__dirname}/ns-usbloader-7.0.jar`,
    "-n",
    `nsip=${ip}`,
    ...paths,
  ]);
}
