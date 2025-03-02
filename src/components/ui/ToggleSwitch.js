import React from "react";
import Switch from "@mui/material/Switch";

const ToggleSwitch = ({ checked, onChange }) => {
  return (
    <Switch
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      color="primary"
    />
  );
};

export default ToggleSwitch;