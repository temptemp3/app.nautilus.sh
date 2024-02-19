import React, { useState } from "react";
import styled from "styled-components";

interface RadioOptions {
  value: string;
  label: string;
}

const radioOptions: RadioOptions[] = [
  { value: "all", label: "All" },
  { value: "art", label: "Art" },
  { value: "gaming", label: "Gaming" },
  { value: "photography", label: "Photography" },
  { value: "music", label: "Music" },
  { value: "animation", label: "Animation" },
];

const RadioContainer = styled.div`
  display: flex;
`;

const RadioOption = styled.label`
  display: block;
  margin-right: 5px;
`;

const RadioInput = styled.input`
  display: none; /* Hide the default radio button */
`;

const RadioLabel = styled.span`
  display: inline-block;
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  font-family: Inter;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0px;
  text-align: left;

  font-weight: 500;
  color: #717579;
  background-color: #eaebf0;
  border: 1px solid #eaebf0;
`;

const ActiveLabel = styled(RadioLabel)`
  font-weight: 700;
  color: #9933ff;
  background-color: #9933ff1a;
  border: 1px solid #9933ff;
`;

const RadioInputs: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("all");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <RadioContainer>
      {radioOptions.map((option) => (
        <RadioOption key={option.value}>
          <RadioInput
            type="radio"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionChange}
          />
          {selectedOption === option.value ? (
            <ActiveLabel>{option.label}</ActiveLabel>
          ) : (
            <RadioLabel>{option.label}</RadioLabel>
          )}
        </RadioOption>
      ))}
    </RadioContainer>
  );
};

export default RadioInputs;
