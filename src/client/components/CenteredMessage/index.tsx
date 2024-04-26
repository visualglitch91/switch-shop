import { Box } from "@mui/material";

export default function CenteredMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 4,
      }}
    >
      {children}
    </Box>
  );
}
