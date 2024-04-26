import { Stack, styled } from "@mui/material";
import Poster from "../Poster";

const Title = styled("span")({
  fontSize: 14,
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
});

const Subtitle = styled("span")({ fontSize: 12 });

export default function MediaCard({
  minimal,
  posterSrc,
  posterHeight,
  posterObjectFit,
  posterAspectRatio,
  title,
  subtitle,
  chip,
}: {
  minimal?: boolean;
  posterSrc?: string;
  posterHeight: number;
  posterObjectFit?: React.ComponentProps<typeof Poster>["objectFit"];
  posterAspectRatio?: string;
  title: string;
  subtitle?: string;
  chip?: React.ReactNode;
}) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{ overflow: "hidden" }}
    >
      <Poster
        aspectRatio={posterAspectRatio}
        objectFit={posterObjectFit}
        height={posterHeight}
        src={posterSrc || ""}
      />
      {minimal ? (
        <span>{title}</span>
      ) : (
        <Stack spacing={1} alignItems="flex-start" sx={{ overflow: "hidden" }}>
          <Title>{title}</Title>
          <Subtitle>{subtitle}</Subtitle>
          {chip}
        </Stack>
      )}
    </Stack>
  );
}
