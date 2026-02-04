import React from "react";

interface HermineLogoProps {
  className?: string;
}

const HermineLogo: React.FC<HermineLogoProps> = ({ className }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-label="Hermine bretonne"
    >
      {/* Hermine stylisée */}
      <path d="M50 5 L58 30 L50 22 L42 30 Z" />
      <path d="M50 25 L65 55 L50 42 L35 55 Z" />
      <path d="M50 50 L72 95 L50 75 L28 95 Z" />
    </svg>
  );
}

export default HermineLogo;