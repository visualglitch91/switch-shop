import { IconButton, Stack, styled } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { SxProps } from "../theme/utils";
import DialogBase, { DialogBaseControlProps } from "../DialogBase";
import useShellOutput from "./useShellOutput";

const fullscreenSx: SxProps = {
  "& .MuiDialog-paper": {
    margin: 0,
    width: "100vw",
    height: "100vh",
    maxWidth: "unset",
    maxHeight: "unset",
    borderRadius: 0,
  },
};

const Content = styled("div")(({ theme }) => ({
  height: "100%",
  [theme.breakpoints.down("sm")]: { px: 0, pb: 0 },
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

export default function ShellOutputDialog({
  title,
  processId,
  ...props
}: {
  title: string;
  processId: string;
} & DialogBaseControlProps) {
  const { shellOutput } = useShellOutput(processId);

  return (
    <DialogBase
      {...props}
      sx={fullscreenSx}
      title={
        <Stack direction="row" justifyContent="space-between">
          <span>{title}</span>
          <IconButton size="small" onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      }
    >
      <Content>{shellOutput}</Content>
    </DialogBase>
  );
}
