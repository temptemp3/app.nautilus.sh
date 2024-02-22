import React, { useState } from "react";
import { Modal, Button, TextField } from "@mui/material";

interface AddressModalProps {
  open: boolean;
  handleClose: () => void;
  onSave: (address: string) => void;
  title?: string;
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  handleClose,
  onSave,
  title = "Enter Address",
}) => {
  const [address, setAddress] = useState("");

  const handleSave = () => {
    onSave(address);
    setAddress(""); // Clearing input after save
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="address-modal-title"
      aria-describedby="address-modal-description"
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px",
        }}
      >
        <h2 id="address-modal-title">{title}</h2>
        <TextField
          id="address-input"
          label="Address"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default AddressModal;
