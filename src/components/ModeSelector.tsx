import React, { ChangeEvent } from 'react';
import styles from './ModeSelector.module.css';
import { PanelMode, PANEL_MODE_LABELS } from '../types/PanelMode';

interface ModeSelectorProps {
  selectedMode: PanelMode;
  onModeChange: (mode: PanelMode) => void;
}

const ModeSelector = ({ selectedMode, onModeChange }: ModeSelectorProps) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onModeChange(e.target.value as PanelMode);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="mode-selector" className={styles.label}>Mode:</label>
      <select 
        id="mode-selector"
        className={styles.select}
        value={selectedMode}
        onChange={handleChange}
      >
        {Object.entries(PANEL_MODE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default React.memo(ModeSelector);
