import React, { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface ToggleButtonProps {
  selectedOption: string | null;
  handleOptionChange: (
    event: React.MouseEvent<HTMLElement>,
    newOption: string | null
  ) => void;
}

const ToggleButtons: React.FC<ToggleButtonProps> = ({
  selectedOption,
  handleOptionChange,
}) => {
  return (
    <ToggleButtonGroup
      value={selectedOption}
      exclusive
      onChange={handleOptionChange}
      aria-label="toggle options"
    >
      <ToggleButton value="games" aria-label="voiGames">
        Voi Games
      </ToggleButton>
      <ToggleButton value="all" aria-label="all">
        All
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleButtons;
