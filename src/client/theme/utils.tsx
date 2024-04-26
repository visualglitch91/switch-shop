import { Components, Theme, SxProps as MuiSxProps } from "@mui/material";

export type ComponentOverride = Components<Omit<Theme, "components">>;

export type SxProps = MuiSxProps<Theme>;

export function sxx(...args: (SxProps | null | undefined | false | "")[]) {
  return args.filter(Boolean) as SxProps;
}
