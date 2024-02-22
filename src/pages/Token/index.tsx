import React from "react";
import Layout from "../../layouts/Default";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import NFTCard from "../../components/NFTCard";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import styled from "styled-components";
import IconAlarm from "static/icon-alarm.svg";
import ButtonBuy from "static/button-buy.svg";
import ButtonOffer from "static/button-offer.svg";
import ButtonBid from "static/button-bid.svg";
import { stringToColorCode } from "../../utils/string";

import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "react-toastify";
import algosdk from "algosdk";

import SendIcon from "@mui/icons-material/Send";
import { useWallet } from "@txnlab/use-wallet";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabLabel = styled(Typography)`
  font-family: Nohemi;
  font-size: 24px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: center;
`;

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <TabLabel>{children}</TabLabel>
        </Box>
      )}
    </div>
  );
}

const AvatarWithName = styled(Stack)`
  dsplay: flex;
  align-items: center;
  color: #68727d;
  & .owner-name {
    cursor: pointer;
  }
`;

const NFTName = styled.div`
  font-family: Advent Pro;
  font-size: 30px;
  font-weight: 700;
  line-height: 36px;
  letter-spacing: 0em;
  text-align: left;
`;

const PriceDisplay = styled(Stack)`
  gap: 8px;
  & .price-label {
    font-family: Inter;
    font-size: 14px;
    font-weight: 500;
    line-height: 12px;
    letter-spacing: 0em;
    text-align: left;
    color: #68727d;
  }
  & .price-value {
    font-family: Advent Pro;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
    letter-spacing: 0em;
    text-align: left;
  }
`;

const BuyButton = styled.img`
  cursor: pointer;
`;

const OfferButton = styled(BuyButton)``;

const BidButton = styled(BuyButton)``;

const AuctionContainer = styled(Stack)`
  padding: 16px;
  border-radius: 16px;
  border: 1px;
  gap: 8px;
  justify-content: space-between;
  border: 1px solid #eaebf0;
  align-items: center;
  & .auction-left {
    padding: 8px;
    & .auction-label {
      font-family: Inter;
      font-size: 16px;
      font-weight: 500;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
      color: #68727d;
    }
    & .auction-value {
      font-family: Inter;
      font-size: 24px;
      font-weight: 700;
      line-height: 22px;
      letter-spacing: 0em;
      text-align: left;
    }
  }
  & .auction-right {
    display: flex;
    flex-direction: column;
    gap: 10px;
    & .alarm-container {
      align-items: center;
      & .time-remaining {
        font-family: Advent Pro;
        font-size: 14px;
        font-weight: 700;
        line-height: 12px;
        letter-spacing: 0em;
        text-align: left;
      }
    }
  }
`;

const MoreFrom = styled.h3`
  font-family: Advent Pro;
  font-size: 36px;
  font-weight: 700;
  line-height: 40px;
  letter-spacing: 0em;
  text-align: left;
  margin-top: 48px;
`;

export const Token: React.FC = () => {
  /* Wallet */

  const { activeAccount } = useWallet();

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

  const { id, tid } = useParams();
  const navigate = useNavigate();
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  const [nfts, setNfts] = React.useState<any>([]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    try {
      (async () => {
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens?contractId=${id}&tokenId=${tid}`
        );
        console.log({ res });
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
  }, []);
  const [collection, setCollection] = React.useState<any>([]);
  React.useEffect(() => {
    try {
      (async () => {
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens?contractId=${id}`
        );
        const nfts = [];
        for (const t of res) {
          const tm = JSON.parse(t.metadata);
          nfts.push({
            ...t,
            metadata: tm,
          });
        }
        setCollection(nfts);
      })();
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <Layout>
      {nfts.length > 0 ? (
        <Container>
          <Grid
            sx={{
              padding: "48px",
              borderRadius: "16px",
              border: "1px",
              alignItems: "center",
            }}
            container
            spacing="60px"
          >
            {nfts.map((el: any) => {
              return (
                <>
                  <Grid item xs={12} md={6}>
                    <img
                      src={el.metadata.image}
                      style={{ width: "100%", borderRadius: "25px" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack gap={2}>
                      {((addr) => (
                        <AvatarWithName direction="row" gap={1}>
                          <Avatar
                            sx={{
                              height: "24px",
                              width: "24px",
                              background: `linear-gradient(45deg, ${stringToColorCode(
                                addr
                              )}, ${isDarkTheme ? "#000" : "#fff"})`,
                            }}
                          >
                            {addr.slice(0, 1)}
                          </Avatar>
                          <span
                            className="owner-name"
                            onClick={() => {
                              navigate(`/collection/${el.contractId}`);
                            }}
                          >
                            {el.metadata.name.replace(/[#0123456789 ]*$/, "")}
                          </span>
                        </AvatarWithName>
                      ))(algosdk.getApplicationAddress(el.contractId))}
                      <NFTName
                        style={{ color: isDarkTheme ? "#FFFFFF" : undefined }}
                      >
                        {el.metadata.name}
                      </NFTName>
                      <AvatarWithName direction="row" gap={1}>
                        <Avatar
                          sx={{
                            height: "24px",
                            width: "24px",
                            background: `linear-gradient(45deg, ${stringToColorCode(
                              el.owner
                            )}, ${isDarkTheme ? "#000" : "#fff"})`,
                          }}
                        >
                          {el.owner.slice(0, 1)}
                        </Avatar>
                        <span
                          className="owner-name"
                          onClick={() => {
                            navigate(`/account/${el.owner}`);
                          }}
                        >
                          {el.owner.slice(0, 4)}...{el.owner.slice(-4)}
                        </span>
                      </AvatarWithName>
                      <PriceDisplay gap={0.5}>
                        <div className="price-label">Price</div>
                        <div
                          className="price-value"
                          style={{
                            color: isDarkTheme ? "#FFFFFF" : undefined,
                          }}
                        >
                          1,000 VOI
                        </div>
                      </PriceDisplay>
                      <Stack
                        direction="row"
                        gap={2}
                        sx={{ alignItems: "center" }}
                      >
                        <BuyButton src={ButtonBuy} alt="Buy Button" />
                        <OfferButton src={ButtonOffer} alt="Offer Button" />
                        {el.owner === activeAccount?.address ? (
                          <Button>
                            Send &nbsp;
                            <SendIcon
                              fontSize="large"
                              sx={{ transform: "rotate(-15deg)" }}
                            />
                          </Button>
                        ) : null}
                      </Stack>
                      <AuctionContainer direction="row">
                        <div className="auction-left">
                          <Stack gap={0.5}>
                            <div className="auction-label">Auction</div>
                            <div
                              className="auction-value"
                              style={{
                                color: isDarkTheme ? "#FFFFFF" : undefined,
                              }}
                            >
                              1,000 VOI
                            </div>
                          </Stack>
                        </div>
                        <div className="auction-right">
                          <Stack
                            className="alarm-container"
                            direction="row"
                            gap={2}
                          >
                            <img src={IconAlarm} alt="Alarm Icon" />
                            <div
                              className="time-remaining"
                              style={{
                                color: isDarkTheme ? "#FFFFFF" : undefined,
                              }}
                            >
                              36h 10m 34s
                            </div>
                          </Stack>
                          <BidButton src={ButtonBid} alt="Bid Button" />
                        </div>
                      </AuctionContainer>
                    </Stack>
                  </Grid>
                </>
              );
            })}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="History" />
                  <Tab label="Information" />
                  <Tab label="Attributes" />
                  <Tab label="Offers" />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                History
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                Information
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                Attributes
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                Offerse
              </CustomTabPanel>
            </Box>
          </Grid>
          {/*<Grid item xs={12}>
            <MoreFrom style={{ color: isDarkTheme ? "#FFFFFF" : undefined }}>
              {`More from ${nfts[0].metadata.name.replace(
                /[#0123456789 ]*$/,
                ""
              )}`}
            </MoreFrom>
            <Grid container spacing={2} sx={{ justifyContent: "center" }}>
              {collection.slice(0, 4).map((el: any) => {
                return (
                  <Grid item>
                    <NFTCard
                      nftName={el.metadata.name}
                      image={el.metadata.image}
                      price="123,000 VOI"
                      owner={el.owner}
                      onClick={() => {
                        navigate(
                          `/collection/${el.contractId}/token/${el.tokenId}`
                        );
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
            </Grid>*/}
        </Container>
      ) : null}
    </Layout>
  );
};
