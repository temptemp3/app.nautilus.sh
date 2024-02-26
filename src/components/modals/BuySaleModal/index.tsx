import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  CircularProgress,
  Stack,
  InputLabel,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { useWallet } from "@txnlab/use-wallet";
import PaymentCurrencyRadio from "../../PaymentCurrencyRadio";

interface BuySaleModalProps {
  open: boolean;
  loading: boolean;
  handleClose: () => void;
  onSave: () => Promise<void>;
  title?: string;
  buttonText?: string;
  image: string;
  price: string;
}

const BuySaleModal: React.FC<BuySaleModalProps> = ({
  open,
  loading,
  handleClose,
  onSave,
  image,
  price,
  title = "Enter Address",
  buttonText = "Send",
}) => {
  /* Payment currency */

  const [currency, setCurrency] = useState<string>("VIO");

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  /* Modal */

  const handleSave = async () => {
    await onSave();
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
          padding: "40px",
          minHeight: "300px",
          minWidth: "400px",
          width: "50vw",
          borderRadius: "25px",
        }}
      >
        <h2 id="address-modal-title">{title}</h2>
        {!loading ? (
          <>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <img
                  src={image}
                  alt="NFT"
                  style={{ width: "100%", borderRadius: "25px" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    p: 1,
                  }}
                >
                  <InputLabel htmlFor="price">Price</InputLabel>
                  <Typography variant="h5" gutterBottom>
                    {price}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Stack sx={{ mt: 3 }} gap={2}>
                  <Button
                    size="large"
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                  >
                    {buttonText}
                  </Button>
                  <Button
                    size="large"
                    fullWidth
                    variant="outlined"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "20px",
            }}
          >
            <CircularProgress size={200} />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BuySaleModal;
