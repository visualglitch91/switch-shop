import { useState } from "react";
import api from "./utils/api";
import useMountEffect from "./utils/useMountEffect";
import ShellOutputDialog from "./ShellOutputDialog";
import { DialogBaseControlProps } from "./DialogBase";
import { usePrompt } from "./utils/usePrompt";

export default function SwitchInstallDialog({
  paths,
  ...props
}: {
  paths: string[];
} & DialogBaseControlProps) {
  const [processId, setProcessId] = useState<string>();
  const prompt = usePrompt();

  useMountEffect(() => {
    const lastUsedIp = window.localStorage.getItem("last-used-ip") || "";

    prompt({
      title: "Switch IP",
      fields: ["IP"],
      initialValues: [lastUsedIp],
      onConfirm: ([ip]) => {
        window.localStorage.setItem("last-used-ip", ip);

        api<{ processId: string }>("/roms/install", "post", {
          ip,
          paths,
        }).then((res) => setProcessId(res.processId));
      },
    });
  });

  if (!processId) {
    return null;
  }

  return (
    <ShellOutputDialog {...props} processId={processId} title="Installing" />
  );
}
