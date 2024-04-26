import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export interface StandardDialogProps
  extends Omit<DialogProps, "title" | "onClose"> {
  title: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
  disableContentPadding?: boolean;
  onClose: (reason: "backdropClick" | "escapeKeyDown" | "closeButton") => void;
}

export default function StandardDialog({
  title,
  children,
  footer,
  hideCloseButton,
  disableContentPadding,
  onClose,
  ...props
}: StandardDialogProps) {
  return (
    <Dialog {...props} onClose={(_, reason) => onClose(reason)}>
      <DialogTitle sx={hideCloseButton ? undefined : { pr: 7 }}>
        {title}
        {!hideCloseButton && (
          <IconButton
            aria-label="close"
            onClick={() => onClose("closeButton")}
            sx={{
              position: "absolute",
              right: 8,
              top: 13,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      {children && (
        <DialogContent sx={disableContentPadding ? { padding: 0 } : undefined}>
          {children}
        </DialogContent>
      )}
      {footer && <DialogActions>{footer}</DialogActions>}
    </Dialog>
  );
}
