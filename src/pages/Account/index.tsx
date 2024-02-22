import React from "react";
import Layout from "../../layouts/Default";
import {
  Avatar,
  Container,
  Grid,
  Stack,
  Tabs,
  Typography,
} from "@mui/material";
import NFTCard from "../../components/NFTCard";
import Section from "../../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import { stringToColorCode } from "../../utils/string";
import styled from "styled-components";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-toastify";

const AccountLabel = styled.div`
  font-family: Nohemi;
  font-size: 16px;
  font-weight: 500;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
  color: #717579;
`;

const AccountValue = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
`;

export const Account: React.FC = () => {
  /* Copy to clipboard */

  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        console.log("Copied!", { text });
        toast.success("Copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy to clipboard!");
      });
  };

  /* Router */

  const { id } = useParams();
  const navigate = useNavigate();

  /* Theme */

  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );

  /* NFTs */

  const [nfts, setNfts] = React.useState<any>([]);
  React.useEffect(() => {
    try {
      (async () => {
        const ids = String(id).split(",");
        if (!ids) {
          return;
        }
        const query = ids.map((id) => `owner[]=${id}`).join("&");
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens?${query}`
        );
        const nfts = [];
        for (const t of res) {
          const tm = JSON.parse(t.metadata);
          nfts.push({
            ...t,
            metadata: tm,
          });
        }
        setNfts(nfts);
      })();
    } catch (e) {
      console.log(e);
    }
  }, [id]);
  console.log({ nfts });
  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{
          color: isDarkTheme ? "#fff" : "#000",
        }}
      >
        <Stack spacing={2} direction="row">
          <Avatar
            sx={{
              background: `linear-gradient(45deg, ${stringToColorCode(
                String(id)
              )}, ${isDarkTheme ? "#000" : "#fff"})`,
              width: "145px",
              height: "145px",
            }}
          >
            {String(id).slice(0, 1)}
          </Avatar>
          <Grid container spacing={2}>
            {id?.split(",")?.map((id) => (
              <Grid item xs={12} key={id}>
                <Stack gap={0.1}>
                  <AccountLabel>Account</AccountLabel>
                  <Stack direction="row" gap={1}>
                    <AccountValue>
                      {String(id).slice(0, 4)}...{String(id).slice(-4)}
                    </AccountValue>
                    <ContentCopyIcon
                      onClick={() => {
                        handleCopy(String(id))();
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Stack>
        <Typography variant="h4" sx={{ my: 5 }}>
          Collected <small>{nfts.length}</small>
        </Typography>
        <Grid container spacing={0}>
          {nfts.map((nft: any) => {
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={nft.id}>
                <img
                  style={{ width: "100%", cursor: "pointer" }}
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  onClick={() => {
                    navigate(
                      `/collection/${nft.contractId}/token/${nft.tokenId}`
                    );
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Layout>
  );
};
