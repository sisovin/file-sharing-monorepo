import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded ${
        disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'
      } text-white`}
    >
      {children}
    </button>
  );
};

export default Button;
