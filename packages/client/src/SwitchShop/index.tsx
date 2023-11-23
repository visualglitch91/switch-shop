import { useEffect, useState } from "react";
import { Search as SearchIcon } from "@mui/icons-material";
import { AppBar, Button, Toolbar } from "@mui/material";
import useModal from "../utils/useModal";
import RomList from "../RomList";
import SwitchInstallDialog from "../SwitchInstallDialog";
import { Offset, Search, SearchIconWrapper, StyledInputBase } from "./styled";

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

          {selected.length > 0 && (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  setSearch("");
                  setSelectedOnly(!selectedOnly);
                }}
              >
                {selectedOnly ? "View All" : `View Selected (${totalSelected})`}
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  mount((_, props) => (
                    <SwitchInstallDialog {...props} paths={selected} />
                  ));
                }}
              >
                Send files
              </Button>
            </>
          )}
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
    </>
  );
}
