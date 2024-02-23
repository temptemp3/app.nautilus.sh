import React, { useEffect } from "react";
import Layout from "../../layouts/Default";
import {
  Avatar,
  Button,
  ButtonGroup,
  Chip,
  Container,
  Grid,
  Stack,
  Tabs,
  Typography,
} from "@mui/material";
import NFTCard from "../../components/NFTCard";
import Section from "../../components/Section";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import { stringToColorCode } from "../../utils/string";
import styled from "styled-components";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-toastify";
import { useWallet } from "@txnlab/use-wallet";
import SendIcon from "@mui/icons-material/Send";
import { getAlgorandClients } from "../../wallets";
import { arc72 } from "ulujs";
import AddressModal from "../../components/modals/AddressModal";

const ExternalLinks = styled.ul`
  & li {
    margin-top: 10px;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
`;

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
  /* Router */

  const { id } = useParams();
  const navigate = useNavigate();

  /* Selection */
  const [selected, setSelected] = React.useState(-1);

  /* Wallet */
  const {
    activeAccount,
    providers,
    connectedAccounts,
    signTransactions,
    sendTransactions,
  } = useWallet();
  useEffect(() => {
    if (selected === -1 || !activeAccount) return;
    (async () => {
      const nft = nfts[selected];
      const arc72_ownerOf = nft.owner;
      if (arc72_ownerOf === activeAccount?.address) {
        // do nothing
      } else if (
        !!connectedAccounts.find(
          (a) =>
            a.address === arc72_ownerOf &&
            activeAccount?.providerId === a.providerId
        )
      ) {
        // switch active account
        const provider = providers?.find(
          (a) => a.metadata.id === activeAccount?.providerId
        );
        provider?.setActiveAccount(arc72_ownerOf);
      } else {
        const account = connectedAccounts.find(
          (a) => a.address === arc72_ownerOf
        );
        const provider = providers?.find(
          (a) => a.metadata.id === account?.providerId
        );
        provider?.setActiveProvider();
        provider?.setActiveAccount(arc72_ownerOf);
      }
    })();
  }, [selected, activeAccount]);

  /* Copy to clipboard */

  const [copiedText, copy] = useCopyToClipboard();

  const handleCopy = (text: string) => () => {
    copy(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((error) => {
        toast.error("Failed to copy to clipboard!");
      });
  };

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

  /* Transaction */

  const [open, setOpen] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const handleTransfer = async (addr: string) => {
    try {
      setProgress(25);
      setIsTransferring(true);
      const nft: any = nfts[selected];
      const { contractId, tokenId } = nft;
      const { algodClient, indexerClient } = getAlgorandClients();
      const ci = new arc72(contractId, algodClient, indexerClient, {
        acc: { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
      });
      const arc72_ownerOfR = await ci.arc72_ownerOf(tokenId);
      if (!arc72_ownerOfR.success) {
        throw new Error("arc72_ownerOf failed in simulate");
      }
      const arc72_ownerOf = arc72_ownerOfR.returnValue;
      if (arc72_ownerOf !== activeAccount?.address) {
        throw new Error("arc72_ownerOf not connected");
      }
      const arc72_transferFromR = await ci.arc72_transferFrom(
        activeAccount?.address || "",
        addr,
        BigInt(tokenId),
        true,
        false
      );
      if (!arc72_transferFromR.success) {
        throw new Error("arc72_transferFrom failed in simulate");
      }
      const txns = arc72_transferFromR.txns;
      setProgress(50);
      const res = await signTransactions(
        txns.map((txn) => new Uint8Array(Buffer.from(txn, "base64")))
      ).then(sendTransactions);
      setProgress(75);
      toast.success(`NFT Transfer successful!`);
      setProgress(100);
      setNfts([
        ...nfts.slice(0, selected),
        { ...nft, owner: addr },
        ...nfts.slice(selected + 1),
      ]);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsTransferring(false);
      setOpen(false);
      setProgress(0);
    }
  };

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
                <Stack
                  gap={0.1}
                  sx={{
                    p: 1,
                    background:
                      selected >= 0 && nfts[selected]?.owner === id
                        ? "rgba(139, 44, 195, 0.1)"
                        : undefined,
                  }}
                >
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
        <Typography variant="h4" sx={{ mt: 3 }}>
          Collected <small>{nfts.length}</small>
        </Typography>
        <Stack
          sx={{
            mt: 3,
            justifyContent: "center",
            alignItems: "center",
          }}
          spacing={2}
          direction="row"
        >
          {selected >= 0 ? (
            <>
              <ButtonGroup>
                <Button
                  onClick={() => {
                    navigate(
                      `/collection/${nfts[selected].contractId}/token/${nfts[selected].tokenId}`
                    );
                  }}
                >
                  View
                </Button>
                <Button>List (coming soon)</Button>
                <Button
                  size="large"
                  variant="outlined"
                  onClick={() => setOpen(true)}
                >
                  Transfer
                </Button>
                <Button
                  onClick={() => {
                    setSelected(-1);
                  }}
                >
                  Clear
                </Button>
              </ButtonGroup>
            </>
          ) : null}
        </Stack>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {nfts.map((nft: any, index: number) => {
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={nft.id}>
                <img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: 10,
                    border:
                      selected === index
                        ? "5px solid rgb(139, 44, 195)"
                        : isDarkTheme
                        ? "5px solid rgb(22, 23, 23)"
                        : "5px solid #fff",
                  }}
                  src={nft.metadata.image}
                  alt={nft.metadata.name}
                  onClick={() => {
                    if (id?.indexOf(activeAccount?.address || "") !== -1) {
                      if (selected === index) {
                        setSelected(-1);
                      } else {
                        setSelected(index);
                      }
                    } else {
                      navigate(
                        `/collection/${nft.contractId}/token/${nft.tokenId}`
                      );
                    }
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
        <Typography
          sx={{ mt: 5, color: isDarkTheme ? "#fff" : "#000" }}
          variant="h6"
        >
          External Links
        </Typography>
        <ExternalLinks
          style={{
            listStyle: "none",
          }}
        >
          <li>
            <StyledLink
              target="_blank"
              to={`https://nftnavigator.xyz/portfolio/${id}`}
              style={{ color: isDarkTheme ? "#fff" : "#000" }}
            >
              <img
                src="https://nftnavigator.xyz/_app/immutable/assets/android-chrome-192x192.44ed2806.png"
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "5px",
                }}
              />{" "}
              NFT Navigator
            </StyledLink>
          </li>
        </ExternalLinks>
      </Container>
      <AddressModal
        title="Transfer NFT"
        loading={isTransferring}
        open={open}
        handleClose={() => setOpen(false)}
        onSave={handleTransfer}
      />
    </Layout>
  );
};
