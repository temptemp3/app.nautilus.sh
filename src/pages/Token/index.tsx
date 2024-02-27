import React, { useCallback, useEffect, useMemo } from "react";
import Layout from "../../layouts/Default";
import {
  Avatar,
  Container,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
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

import { useWallet } from "@txnlab/use-wallet";

import algosdk from "algosdk";
import { MarketplaceContext } from "../../store/MarketplaceContext";
import { decodePrice, decodeTokenId } from "../../utils/mp";
import NftCard from "../../components/NFTCard";
import BuySaleModal from "../../components/modals/BuySaleModal";

import { CONTRACT, arc72, arc200 } from "ulujs";
import { getAlgorandClients } from "../../wallets";
import { ctcInfoMp206 } from "../../contants/mp";

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
`;

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

const { algodClient, indexerClient } = getAlgorandClients();

export const Token: React.FC = () => {
  /* Marketplace */
  const { forSale } = React.useContext(MarketplaceContext);
  /* Wallet */
  const { activeAccount, signTransactions, sendTransactions } = useWallet();
  /* Router */
  const { id, tid } = useParams();
  const navigate = useNavigate();
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
  /* Theme */
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  /* NFT Navigator NFTs */
  const [nfts, setNfts] = React.useState<any>([]);
  React.useEffect(() => {
    if (!forSale) return;
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
  }, [forSale, id]);
  const isForSale = useMemo(() => {
    if (!forSale || nfts.length == 0) return false;
    return forSale
      .map((el: any) => [Number(el.cId), Number(el.tId)].join(":"))
      .includes(`${nfts[0].contractId}:${nfts[0].tokenId}`);
  }, [forSale, nfts]);
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

  const [nft, setNft] = React.useState<any>(null);
  useEffect(() => {
    if (collection.length === 0 || !tid) return;
    setNft(collection.find((el: any) => el.tokenId === Number(tid)));
  }, [collection, id]);

  const listing = React.useMemo(() => {
    if (!nft || !forSale) return null;
    const listing = forSale.find((el: any) => {
      return (
        Number(el.cId) === nft.contractId && Number(el.tId) === nft.tokenId
      );
    });
    return listing;
  }, [nft, forSale]);

  console.log({ listing });

  const price = useMemo(() => {
    if (!listing) return 0;
    const price = decodePrice(listing.lPrc);
    return price;
  }, [listing]);
  const moreNfts = React.useMemo(() => {
    if (collection.length === 0 || !nft) return [];
    return collection.filter(
      (el: any) =>
        el.tokenId !== nft.tokenId &&
        forSale
          .map((el: any) => [Number(el.cId), Number(el.tId)].join(":"))
          .includes(`${el.contractId}:${el.tokenId}`)
    );
  }, [collection, nft, forSale]);

  /* Modal */
  const [openBuyModal, setOpenBuyModal] = React.useState(false);
  const [isBuying, setIsBuying] = React.useState(false);
  const handleBuy = async () => {
    try {
      if (!activeAccount) {
        throw new Error("Please connect your wallet first!");
      }
      setIsBuying(true);
      const collectionAddr = algosdk.getApplicationAddress(nft.contractId);
      console.log({ collectionAddr, contractId: nft.contractId });
      const collectionAccountInfo = await algodClient
        .accountInformation(collectionAddr)
        .do();
      console.log({ collectionAccountInfo });
      const { amount, ["min-balance"]: minBalance } = collectionAccountInfo;
      console.log({ amount, minBalance });
      const availableBalance = amount - minBalance;
      const boxCost = 28500;
      console.log({ availableBalance, boxCost });
      const addBoxPayment = availableBalance < boxCost;
      const [pType, ...prc] = listing.lPrc;
      switch (pType) {
        case "00": {
          const builder = {
            mp: new CONTRACT(
              ctcInfoMp206,
              algodClient,
              indexerClient,
              {
                name: "",
                desc: "",
                methods: [
                  {
                    name: "a_sale_buyNet",
                    args: [
                      {
                        name: "listId",
                        type: "uint256",
                      },
                    ],
                    returns: {
                      type: "void",
                    },
                  },
                ],
                events: [],
              },
              { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
              undefined,
              undefined,
              true
            ),
          };

          // const ci = new CONTRACT(
          //   ctcInfoMp206,
          //   algodClient,
          //   indexerClient,
          //   {
          //     name: "",
          //     desc: "",
          //     methods: [
          //       {
          //         name: "a_sale_buyNet",
          //         args: [
          //           {
          //             name: "listId",
          //             type: "uint256",
          //           },
          //         ],
          //         returns: {
          //           type: "void",
          //         },
          //       },
          //     ],
          //     events: [],
          //   },
          //   {
          //     addr: activeAccount?.address || "",
          //     sk: new Uint8Array(0),
          //   }
          // );

          const customTxn = (
            await Promise.all([builder.mp.a_sale_buyNet(listing.lId)])
          ).map(({ obj }) => obj);

          const ci = new CONTRACT(
            //ptid,
            ctcInfoMp206,
            algodClient,
            indexerClient,
            {
              name: "",
              desc: "",
              methods: [
                {
                  name: "custom",
                  args: [],
                  returns: {
                    type: "void",
                  },
                },
              ],
              events: [],
            },
            {
              addr: activeAccount?.address || "",
              sk: new Uint8Array(0),
            }
          );

          ci.setExtraTxns(customTxn);
          const price = decodePrice(listing.lPrc) || 0;
          ci.setFee(10000);
          ci.setPaymentAmount(price);
          ci.setEnableGroupResourceSharing(true);

          // ci.setAccounts([
          //   listing.lAddr,
          //   "RTKWX3FTDNNIHMAWHK5SDPKH3VRPPW7OS5ZLWN6RFZODF7E22YOBK2OGPE",
          // ]);
          // const a_sale_buyNetR = await ci.a_sale_buyNet(listing.lId);
          // console.log({ a_sale_buyNetR });
          // if (!a_sale_buyNetR.success) {
          //   throw new Error("Failed to simulate buyNet");
          // }
          // await signTransactions(
          //   a_sale_buyNetR.txns.map(
          //     (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
          //   )
          // ).then(sendTransactions);

          const customR = await ci.custom();
          console.log({ customR });
          await signTransactions(
            customR.txns.map(
              (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
            )
          ).then(sendTransactions);

          break;
        }
        case "01": {
          console.log({ prc });
          const [tId, tPrc] = prc;
          const ptid = Number("0x" + tId);
          const tprc = Number("0x" + tPrc.slice(0, tPrc.length - 4));
          console.log({ ptid, tprc });
          // conditional payment to collection for transfer
          const ciArc200 = new arc200(ptid, algodClient, indexerClient);
          const hasAllowanceR = await ciArc200.hasAllowance(
            activeAccount.address,
            collectionAddr
          );
          if (!hasAllowanceR.success) {
            throw new Error("Failed to check allowance");
          }
          const hasAllowance = hasAllowanceR.returnValue;
          if (hasAllowance === 0) {
            const ci = new CONTRACT(
              ptid,
              algodClient,
              indexerClient,
              {
                name: "",
                desc: "",
                methods: [
                  {
                    name: "arc200_approve",
                    desc: "Approve spender for a token",
                    args: [{ type: "address" }, { type: "uint256" }],
                    returns: { type: "bool", desc: "Success" },
                  },
                ],
                events: [],
              },
              { addr: activeAccount?.address || "", sk: new Uint8Array(0) }
            );
            ci.setPaymentAmount(28100);
            const arc200_approveR = await ci.arc200_approve(
              algosdk.getApplicationAddress(ctcInfoMp206),
              0
            );
            if (!arc200_approveR.success) {
              throw new Error("Failed to approve spender");
            }
            await signTransactions(
              arc200_approveR.txns.map(
                (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
              )
            ).then(sendTransactions);
          }

          if (addBoxPayment) {
            const paymentTxn =
              algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                from: activeAccount.address,
                to: collectionAddr,
                amount: 28500,
                suggestedParams: await algodClient.getTransactionParams().do(),
              });
            await signTransactions([paymentTxn.toByte()]).then(
              sendTransactions
            );
          }

          const builder = {
            mp: new CONTRACT(
              ctcInfoMp206,
              algodClient,
              indexerClient,
              {
                name: "",
                desc: "",
                methods: [
                  {
                    name: "a_sale_buySC",
                    args: [
                      {
                        name: "listId",
                        type: "uint256",
                      },
                    ],
                    returns: {
                      type: "void",
                    },
                  },
                ],
                events: [],
              },
              { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
              undefined,
              undefined,
              true
            ),
            arc200: new CONTRACT(
              ptid,
              algodClient,
              indexerClient,
              {
                name: "",
                desc: "",
                methods: [
                  {
                    name: "arc200_approve",
                    desc: "Approve spender for a token",
                    args: [{ type: "address" }, { type: "uint256" }],
                    returns: { type: "bool", desc: "Success" },
                  },
                  {
                    name: "arc200_transfer",
                    desc: "Transfers tokens",
                    args: [
                      {
                        type: "address",
                      },
                      {
                        type: "uint256",
                      },
                    ],
                    returns: { type: "bool" },
                  },
                ],
                events: [],
              },
              { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
              undefined,
              undefined,
              true
            ),
          };
          const ci = new CONTRACT(
            //ptid,
            ctcInfoMp206,
            algodClient,
            indexerClient,
            {
              name: "",
              desc: "",
              methods: [
                {
                  name: "custom",
                  args: [],
                  returns: {
                    type: "void",
                  },
                },
              ],
              events: [],
            },
            {
              addr: activeAccount?.address || "",
              sk: new Uint8Array(0),
            }
          );

          const customTxn = (
            await Promise.all([
              builder.arc200.arc200_approve(
                algosdk.getApplicationAddress(ctcInfoMp206),
                tprc
              ),
              builder.mp.a_sale_buySC(listing.lId),
            ])
          ).map(({ obj }) => obj);

          console.log({ customTxn });
          ci.setPaymentAmount(28500);
          ci.setAccounts([
            "VIAGCPULN6FUTHUNPQZDRQIHBT7IUVT264B3XDXLZNX7OZCJP6MEF7JFQU", // tokenAddr
          ]);
          ci.setExtraTxns(customTxn);
          ci.setFee(13000);
          ci.setEnableGroupResourceSharing(true);
          ci.setBeaconId(ctcInfoMp206);
          const customR = await ci.custom();

          console.log({ customR });

          await signTransactions(
            customR.txns.map(
              (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
            )
          ).then(sendTransactions);

          break;
        }
        default: {
          throw new Error("Invalid price type!");
        }
      }
      setNft({
        ...nft,
        owner: activeAccount?.address || "",
        approved: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
      });
      toast.success("NFT purchase successful!");
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setIsBuying(false);
      setOpenBuyModal(false);
    }
  };
  const isLoading = React.useMemo(() => !nft || !forSale, [nft, forSale]);
  return (
    <Layout>
      {!isLoading ? (
        <Container sx={{ mt: 5 }}>
          <Grid
            sx={{
              //padding: "48px",
              border: "1px",
              alignItems: "center",
            }}
            container
            spacing="60px"
          >
            <Grid item xs={12} md={6}>
              {!isLoading ? (
                <img
                  src={nft.metadata.image}
                  style={{ width: "100%", borderRadius: "16px" }}
                />
              ) : (
                <Skeleton
                  variant="rounded"
                  height={600}
                  width={600}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: "16px",
                  }}
                />
              )}
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
                        navigate(`/collection/${nft.contractId}`);
                      }}
                    >
                      {nft.metadata.name.replace(/[#0123456789 ]*$/, "")}
                    </span>
                  </AvatarWithName>
                ))(algosdk.getApplicationAddress(nft.contractId))}

                <NFTName style={{ color: isDarkTheme ? "#FFFFFF" : undefined }}>
                  {nft.metadata.name}
                </NFTName>
                {nft.owner ? (
                  <AvatarWithName direction="row" gap={1}>
                    <Avatar
                      sx={{
                        height: "24px",
                        width: "24px",
                        background: `linear-gradient(45deg, ${stringToColorCode(
                          nft.owner
                        )}, ${isDarkTheme ? "#000" : "#fff"})`,
                      }}
                    >
                      {nft.owner.slice(0, 1)}
                    </Avatar>
                    <span
                      className="owner-name"
                      onClick={() => {
                        navigate(`/account/${nft.owner}`);
                      }}
                    >
                      {nft.owner.slice(0, 4)}...{nft.owner.slice(-4)}
                    </span>
                  </AvatarWithName>
                ) : (
                  <Skeleton variant="text" width={150} height={24} />
                )}
                {!isLoading ? (
                  <PriceDisplay gap={0.5}>
                    <div className="price-label">Price</div>
                    <div
                      className="price-value"
                      style={{
                        color: isDarkTheme ? "#FFFFFF" : undefined,
                      }}
                    >
                      {!price ||
                      nft.approved ===
                        "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ"
                        ? "Not Available"
                        : `${(price / 1e6).toLocaleString()} ${
                            decodeTokenId(listing.lPrc) === 0 ? "VOI" : "VIA"
                          }`}
                    </div>
                  </PriceDisplay>
                ) : (
                  <Skeleton variant="text" width={150} height={24} />
                )}
                {nft.approved !==
                "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ" ? (
                  <>
                    <Stack
                      direction="row"
                      gap={2}
                      sx={{ alignItems: "center" }}
                    >
                      {isForSale ? (
                        <BuyButton
                          src={ButtonBuy}
                          alt="Buy Button"
                          onClick={() => setOpenBuyModal(true)}
                        />
                      ) : null}
                      {false && (
                        <OfferButton src={ButtonOffer} alt="Offer Button" />
                      )}
                    </Stack>
                    {false ? (
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
                    ) : null}
                  </>
                ) : null}
              </Stack>
            </Grid>
          </Grid>
          {/*<Grid item xs={12}>
            <Typography
              sx={{ mt: 5, color: isDarkTheme ? "#fff" : "#000" }}
              variant="h6"
            >
              External Links
            </Typography>
            <ul
              style={{
                listStyle: "none",
              }}
            >
              <li>
                <StyledLink
                  target="_blank"
                  to={`https://nftnavigator.xyz/collection/${id}/token/${tid}`}
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
            </ul>
                  </Grid>*/}
          {!isLoading && moreNfts.length > 0 ? (
            <Grid item xs={12}>
              <MoreFrom style={{ color: isDarkTheme ? "#FFFFFF" : undefined }}>
                {`More from ${nft.metadata.name.replace(
                  /[#0123456789 ]*$/,
                  ""
                )}`}
              </MoreFrom>
              <Grid container spacing={2}>
                {moreNfts.map((el: any) => {
                  return (
                    <Grid item xs={6} sm={4} md={3} lg={2}>
                      <NftCard
                        nftName={el.metadata.name}
                        image={el.metadata.image}
                        price="123,000 VOI"
                        owner={el.owner}
                        onClick={() => {
                          const nft = collection.find(
                            (el2: any) =>
                              el2.contractId === el.contractId &&
                              el2.tokenId === el.tokenId
                          );
                          setNft(nft);
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          ) : null}
        </Container>
      ) : (
        <Container sx={{ mt: 5 }}>
          <Grid
            sx={{
              border: "1px",
              alignItems: "center",
            }}
            container
            spacing="60px"
          >
            <Grid item xs={12} md={6}>
              <Skeleton
                variant="rounded"
                height={459}
                width={459}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  borderRadius: "16px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack gap={2}>
                <Skeleton variant="text" height={24} width={100} />
                <Skeleton variant="text" height={24} width={75} />
                <Skeleton variant="text" height={24} width={150} />
                <Skeleton variant="text" height={24} width={25} />
                <Skeleton variant="text" height={24} width={150} />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="text" height={48} width={200} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4].map(() => (
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <Skeleton
                      variant="rounded"
                      height={400}
                      width={232}
                      sx={{
                        borderRadius: "16px",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      )}
      {price ? (
        <BuySaleModal
          image={nft?.metadata?.image}
          price={`${price / 1e6} VOI`}
          title="Buy NFT for Sale"
          loading={isBuying}
          open={openBuyModal}
          handleClose={() => setOpenBuyModal(false)}
          onSave={handleBuy}
          buttonText="Buy"
        />
      ) : null}
    </Layout>
  );
};
