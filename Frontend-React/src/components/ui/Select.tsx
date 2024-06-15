"use client";

import { useId, useState } from "react";
import ReactSelect from "react-select";

type Props = {
  options: any[];
  isDisabled?: boolean;
  onChange: (selectedOption: any) => void;
};

const Select: React.FC<Props> = ({ options, onChange, isDisabled }: Props) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleInputChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
    onChange(selectedOption);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#383b42",
      borderRadius: "12px",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      outline: "none",
      appearance: "none",
      boxShadow: "none",
      borderColor: "transparent",
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
      "&:focus": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
    }),
    input: (provided: any, state: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      outline: "none",
      appearance: "none",
      boxShadow: "none",
      borderColor: "transparent",
      cursor: "text",
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
      "&:focus": {
        borderColor: state.isFocused ? "transparent" : "#555555",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#383b42",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      borderBottomLeftRadius: "12px",
      borderBottomRightRadius: "12px",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#555555" : "#383b42",
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
      borderRadius: "12px",
      "&:hover": {
        backgroundColor: "#555555",
      },
      cursor: "pointer",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "white",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "var(--font-bold)",
    }),
    dropdownIndicator: (provided: any, state: any) => ({
      ...provided,
      color: "#666666",
      transform: state.isFocused ? "rotate(180deg)" : "none",
      transition: "transform 0.2s ease",
    }),
  };

  return (
    <ReactSelect
      instanceId={useId()}
      options={options}
      value={selectedOption}
      onChange={handleInputChange}
      isDisabled={isDisabled}
      placeholder="Select"
      styles={customStyles}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export default Select;
