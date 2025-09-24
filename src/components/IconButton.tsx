import React from "react";
import Image from "next/image";

interface IconButtonProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg p-3 text-left transition-colors ${
        isActive ? "bg-primary-600 text-white" : "hover:bg-grey-300/10"
      }`}
    >
      <Image
        src={icon}
        alt={`${label} icon`}
        width={18}
        height={18}
        className={`mr-2`}
      />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default IconButton;
