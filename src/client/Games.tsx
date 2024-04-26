import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import useModal from "./hooks/useModal";
import DataGrid from "./components/DataGrid";
import CenteredMessage from "./components/CenteredMessage";
import PageLayout from "./components/PageLayout";
import StandardDialog from "./components/StandardDialog";
import MediaCard from "./components/MediaCard";
import { humanizeBytes } from "./utils";

export default function Games() {
  const mount = useModal();
  const $games = useQuery({
    queryKey: ["Switch", "Games"],
    queryFn: () => {
      return ky.get("/api/json").json<
        {
          image: string;
          href: string;
          title: string;
          files: string[];
        }[]
      >();
    },
  });

  const onGameClick = (game) => {
    mount((props) => (
      <StandardDialog {...props} title={game.title}>
        <TableContainer sx={{ minWidth: 400 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell align="right">Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {game.files.map((file: { name: string; size: number }) => (
                <TableRow key={file.name}>
                  <TableCell component="th" scope="row">
                    {file.name}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {humanizeBytes(file.size)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StandardDialog>
    ));
  };

  return (
    <PageLayout title="Nintendo Switch">
      {$games.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <Table sx={{ "& tr": { cursor: "pointer" } }}>
          <TableBody>
            {$games.data?.map((game, i) => (
              <TableRow hover key={i} onClick={() => onGameClick(game)}>
                <TableCell>
                  <MediaCard
                    posterHeight={60}
                    posterSrc={game.image || ""}
                    title={game.title}
                    subtitle={`${game.files.length} files`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageLayout>
  );
}
