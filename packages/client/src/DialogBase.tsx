import {
  Dialog,
  DialogProps,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { SxProps } from "./theme/utils";

export type DialogBaseControlProps = Pick<
  DialogProps,
  "open" | "TransitionProps"
> & {
  onClose: () => void;
};

export interface DialogBaseProps
  extends DialogBaseControlProps,
    Omit<DialogProps, "title" | "onClose"> {
  sx?: SxProps;
  title?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  dividers?: boolean;
}

export default function DialogBase({
  title,
  children,
  footer,
  dividers,
  ...props
}: DialogBaseProps) {
  return (
    <Dialog {...props}>
      {title && (
        <DialogTitle
          sx={
            children && !dividers
              ? {
                  mb: "-16px",
                  "& + .MuiDialogContent-root": { pt: "16px !important" },
                }
              : {}
          }
        >
          {title}
        </DialogTitle>
      )}
      {children && (
        <DialogContent dividers={dividers}>{children}</DialogContent>
      )}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
