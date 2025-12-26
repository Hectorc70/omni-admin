// src/components/Chip.tsx
import React from "react";

interface ChipProps {
  text: string;
  color?: string; // opcional, para personalizar el color del background
}

const Chip: React.FC<ChipProps> = ({ text, color = "bg-primary" }) => {
  return (
    <span
      className={`${color} text-onPrimary  px-3 py-1 rounded-lg text-sm font-medium`}
    >
      {text}
    </span>
  );
};

export default Chip;
