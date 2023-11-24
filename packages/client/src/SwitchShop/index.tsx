import { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { AppBar, Fab, Toolbar } from "@mui/material";
import useModal from "../utils/useModal";
import RomList from "../RomList";
import SwitchInstallDialog from "../SwitchInstallDialog";
import {
  AppBarButton,
  Offset,
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "./styled";

export default function App() {
  const mount = useModal();
  const [search, setSearch] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedOnly, setSelectedOnly] = useState(false);

  const totalSelected = selected.length;

  useEffect(() => {
    if (totalSelected === 0) {
      setSelectedOnly(false);
    }
  }, [totalSelected]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ gap: 1 }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={search}
              type="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <AppBarButton
            disabled={totalSelected === 0}
            onClick={() => {
              setSearch("");
              setSelectedOnly(!selectedOnly);
            }}
          >
            {selectedOnly ? "View All" : `View Selected (${totalSelected})`}
          </AppBarButton>

          <AppBarButton
            disabled={totalSelected === 0}
            sx={(theme) => ({
              [theme.breakpoints.down("md")]: { display: "none" },
            })}
            onClick={() => {
              mount((_, props) => (
                <SwitchInstallDialog {...props} paths={selected} />
              ));
            }}
          >
            Send to Switch
          </AppBarButton>
        </Toolbar>
      </AppBar>
      <Offset />
      <RomList
        search={search}
        selected={selected}
        selectedOnly={selectedOnly}
        onSelect={(path) => {
          const currentIndex = selected.indexOf(path);
          const newChecked = [...selected];

          if (currentIndex === -1) {
            newChecked.push(path);
          } else {
            newChecked.splice(currentIndex, 1);
          }

          setSelected(newChecked);
        }}
      />
      {totalSelected > 0 && (
        <Fab
          color="primary"
          sx={(theme) => ({
            position: "fixed",
            bottom: 16,
            right: 16,
            display: "none",
            [theme.breakpoints.down("md")]: { display: "block" },
          })}
          variant="extended"
          onClick={() => {
            mount((_, props) => (
              <SwitchInstallDialog {...props} paths={selected} />
            ));
          }}
        >
          Send to Switch
        </Fab>
      )}
    </>
  );
}
