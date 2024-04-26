import { Box, Stack, Typography, styled } from "@mui/material";

const PageHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  boxShadow: "0px 10px 13px 0px rgba(20,20,20,0.2)",
  zIndex: 2,
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: { padding: theme.spacing(4, 6) },
}));

const PageContent = styled(Box)({
  position: "relative",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  flexGrow: 1,
});

export const PaddedPageContent = styled(PageContent)(({ theme }) => ({
  padding: theme.spacing(4, 6),
  flexGrow: 1,
}));

export default function PageLayout({
  title,
  header,
  children,
  disableHeaderSpacing,
}: {
  title: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  disableHeaderSpacing?: boolean;
}) {
  return (
    <>
      <PageHeader>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: 18, md: 28 },
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Stack
          spacing={disableHeaderSpacing ? 0 : { xs: 1, md: 2 }}
          mt={disableHeaderSpacing ? 0 : { xs: 1, md: 2 }}
          sx={{ "&:empty": { display: "none" } }}
        >
          {header}
        </Stack>
      </PageHeader>
      <PageContent>{children}</PageContent>
    </>
  );
}
