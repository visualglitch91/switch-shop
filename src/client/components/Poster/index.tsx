import { styled } from "@mui/material";

const Poster = styled("img")<{
  aspectRatio?: string;
  height: number;
  objectFit?: "cover" | "contain";
}>(({ theme, aspectRatio = "1/1", height, objectFit = "cover" }) => ({
  aspectRatio,
  height,
  objectFit: objectFit,
  background: theme.palette.background.default,
  borderRadius: 4,
  textIndent: "-10000px", // Hide broken image indicator
}));

Poster.defaultProps = {
  loading: "lazy",
};

export default Poster;
