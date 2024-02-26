import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface PaymentCurrencyRadioProps {
  selectedValue: string;
  onCurrencyChange: (newCurrency: string) => void;
}

const PaymentCurrencyRadio: React.FC<PaymentCurrencyRadioProps> = ({
  selectedValue,
  onCurrencyChange,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onCurrencyChange(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Payment Currency</FormLabel>
      <RadioGroup
        aria-label="payment-currency"
        name="payment-currency"
        value={selectedValue}
        onChange={handleChange}
      >
        {[
          { value: "0", label: "VIO" },
          { value: "6779767", label: "VIA" },
        ].map((currency) => (
          <FormControlLabel
            key={currency.value}
            value={currency.value}
            control={<Radio />}
            label={currency.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default PaymentCurrencyRadio;
