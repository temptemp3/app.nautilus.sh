import React, { useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const ToggleButtons: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>('all');

  const handleOptionChange = (event: React.MouseEvent<HTMLElement>, newOption: string | null) => {
    if (newOption !== null) {
      setSelectedOption(newOption);
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedOption}
      exclusive
      onChange={handleOptionChange}
      aria-label="toggle options"
    >
      <ToggleButton value="voiGames" aria-label="voiGames">
        Voi Games
      </ToggleButton>
      <ToggleButton value="all" aria-label="all">
        All
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ToggleButtons;
