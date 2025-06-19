import React from 'react';
import styles from './ModeSelector.module.css';
import CustomSelect from './CustomSelect';
import { PanelMode, PANEL_MODE_LABELS } from '../types/PanelMode';

interface ModeSelectorProps {
  selectedMode: PanelMode;
  onModeChange: (mode: PanelMode) => void;
}

const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  const options = Object.entries(PANEL_MODE_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const handleChange = (value: string) => {
    onModeChange(value as PanelMode);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="mode-selector" className={styles.label}>Mode:</label>
      <CustomSelect
        id="mode-selector"
        value={selectedMode}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
};

export default React.memo(ModeSelector);
