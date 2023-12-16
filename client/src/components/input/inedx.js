import "./input.css";
import React from "react";

const Input = ({ icon, placeholder, title, className, onChange }) => {
  return (
    <div className={className}>
      {title && <span className="text-lg font-bold">{title}</span>}
      <div className="container mt-2">
        {icon && <img alt={"icon"} src={icon} width={20} height={20} />}
        <input placeholder={placeholder} onChange={onChange} />
      </div>
    </div>
  );
};

export default Input;
