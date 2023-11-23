import { useState } from "react";
import {
  List,
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "./utils/api";

export default function RomList({
  search,
  selected,
  selectedOnly,
  onSelect,
}: {
  search: string;
  selected: string[];
  selectedOnly: boolean;
  onSelect: (path: string) => void;
}) {
  const { data } = useQuery(["rom-list"], () => api("/roms/list", "get"));

  const filteredData = (data || []).filter((path: string) =>
    path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <List>
      {filteredData.map((path: string) => {
        const labelId = `checkbox-list-label-${path}`;
        const fileName = path.split("/").pop();
        const isSelected = selected.indexOf(path) !== -1;

        if (!isSelected && selectedOnly) {
          return null;
        }

        return (
          <ListItem key={path} disablePadding>
            <ListItemButton
              dense
              role={undefined}
              onClick={() => onSelect(path)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={isSelected}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={fileName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
