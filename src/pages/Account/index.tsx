import React, { useContext, useEffect, useMemo } from "react";
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
import { arc72, CONTRACT, abi } from "ulujs";
import TransferModal from "../../components/modals/TransferModal";
import ListSaleModal from "../../components/modals/ListSaleModal";
import algosdk from "algosdk";
import { ctcInfoMp206 } from "../../contants/mp";
import { MarketplaceContext } from "../../store/MarketplaceContext";
import { decodeRoyalties } from "../../utils/hf";

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
  const { forSale } = useContext(MarketplaceContext);

  /* Router */

  const { id } = useParams();
  const navigate = useNavigate();

  /* Selection */
  const [selected, setSelected] = React.useState(-1);
  const [selected2, setSelected2] = React.useState(-1);

  /* Wallet */
  const {
    activeAccount,
    providers,
    connectedAccounts,
    signTransactions,
    sendTransactions,
  } = useWallet();

  const listed = useMemo(() => {
    return forSale?.filter((el: any) => el.lAddr === activeAccount?.address);
  }, [forSale, activeAccount]);

  // useEffect(() => {
  //   if (selected === -1 || !activeAccount) return;
  //   (async () => {
  //     const nft = nfts[selected];
  //     const arc72_ownerOf = nft.owner;
  //     if (arc72_ownerOf === activeAccount?.address) {
  //       // do nothing
  //     } else if (
  //       !!connectedAccounts.find(
  //         (a) =>
  //           a.address === arc72_ownerOf &&
  //           activeAccount?.providerId === a.providerId
  //       )
  //     ) {
  //       // switch active account
  //       const provider = providers?.find(
  //         (a) => a.metadata.id === activeAccount?.providerId
  //       );
  //       provider?.setActiveAccount(arc72_ownerOf);
  //     } else {
  //       const account = connectedAccounts.find(
  //         (a) => a.address === arc72_ownerOf
  //       );
  //       const provider = providers?.find(
  //         (a) => a.metadata.id === account?.providerId
  //       );
  //       provider?.setActiveProvider();
  //       provider?.setActiveAccount(arc72_ownerOf);
  //     }
  //   })();
  // }, [selected, activeAccount]);

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
  console.log({ nfts });
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
          const royalties = tm.royalties
            ? decodeRoyalties(tm.royalties)
            : undefined;
          nfts.push({
            ...t,
            metadata: tm,
            royalties,
          });
        }
        nfts.sort((a, b) => {
          return a.contractId !== b.contractId
            ? b.contractId - a.contractId
            : a.tokenId - b.tokenId;
        });
        setNfts(nfts);
      })();
    } catch (e) {
      console.log(e);
    }
  }, [id]);
  console.log({ nfts });

  /* Transaction */

  const [open, setOpen] = React.useState(false);
  const [isTransferring, setIsTransferring] = React.useState(false);
  const [openListSale, setOpenListSale] = React.useState(false);
  const [isListing, setIsListing] = React.useState(false);

  const [activeTab, setActiveTab] = React.useState(0);

  const handleListSale = async (price: string, currency: string) => {
    const priceN = Number(price);
    const currencyN = Number(currency);
    try {
      if (isNaN(priceN)) {
        throw new Error("Invalid price");
      }
      if (isNaN(currencyN)) {
        throw new Error("Invalid currency");
      }
      if (!activeAccount) {
        throw new Error("No active account");
      }
      setIsListing(true);
      const nft: any = nfts[selected];
      const { contractId, tokenId } = nft;
      const { algodClient, indexerClient } = getAlgorandClients();

      const ciArc72 = new arc72(contractId, algodClient, indexerClient, {
        acc: { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
      });
      const arc72_ownerOfR = await ciArc72.arc72_ownerOf(tokenId);
      if (!arc72_ownerOfR.success) {
        throw new Error("arc72_ownerOf failed in simulate");
      }
      const arc72_ownerOf = arc72_ownerOfR.returnValue;

      const ListingBoxCost = 131300;
      const builder = {
        arc72: new CONTRACT(
          contractId,
          algodClient,
          indexerClient,
          abi.arc72,
          {
            addr: arc72_ownerOf,
            sk: new Uint8Array(0),
          },
          true,
          false,
          true
        ),
        mp: new CONTRACT(
          ctcInfoMp206,
          algodClient,
          indexerClient,
          {
            name: "mp",
            desc: "mp",
            methods: [
              // a_sale_listNet(CollectionId, TokenId, ListPrice, EndTime, RoyaltyPoints, CreatePoints1, CreatorPoint2, CreatorPoint3, CreatorAddr1, CreatorAddr2, CreatorAddr3)ListId
              {
                name: "a_sale_listNet",
                args: [
                  {
                    name: "collectionId",
                    type: "uint64",
                  },
                  {
                    name: "tokenId",
                    type: "uint256",
                  },
                  {
                    name: "listPrice",
                    type: "uint64",
                  },
                  {
                    name: "endTime",
                    type: "uint64",
                  },
                  {
                    name: "royalty",
                    type: "uint64",
                  },
                  {
                    name: "createPoints1",
                    type: "uint64",
                  },
                  {
                    name: "creatorPoint2",
                    type: "uint64",
                  },
                  {
                    name: "creatorPoint3",
                    type: "uint64",
                  },
                  {
                    name: "creatorAddr1",
                    type: "address",
                  },
                  {
                    name: "creatorAddr2",
                    type: "address",
                  },
                  {
                    name: "creatorAddr3",
                    type: "address",
                  },
                ],
                returns: {
                  type: "uint256",
                },
              },
              {
                name: "a_sale_listSC",
                args: [
                  {
                    name: "collectionId",
                    type: "uint64",
                  },
                  {
                    name: "tokenId",
                    type: "uint256",
                  },
                  {
                    name: "paymentTokenId",
                    type: "uint64",
                  },
                  {
                    name: "listPrice",
                    type: "uint256",
                  },
                  {
                    name: "endTime",
                    type: "uint64",
                  },
                  {
                    name: "royalty",
                    type: "uint64",
                  },
                  {
                    name: "createPoints1",
                    type: "uint64",
                  },
                  {
                    name: "creatorPoint2",
                    type: "uint64",
                  },
                  {
                    name: "creatorPoint3",
                    type: "uint64",
                  },
                  {
                    name: "creatorAddr1",
                    type: "address",
                  },
                  {
                    name: "creatorAddr2",
                    type: "address",
                  },
                  {
                    name: "creatorAddr3",
                    type: "address",
                  },
                ],
                returns: {
                  type: "uint256",
                },
              },
            ],
            events: [],
          },
          {
            addr: arc72_ownerOf,
            sk: new Uint8Array(0),
          },
          true,
          false,
          true
        ),
      };
      const ci = new CONTRACT(
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
          addr: arc72_ownerOf,
          sk: new Uint8Array(0),
        }
      );
      // VOI Sale
      if (currencyN === 0) {
        const customPaymentAmount = [ListingBoxCost];
        const customTxns = (
          await Promise.all([
            builder.mp.a_sale_listNet(
              contractId, // CollectionId
              tokenId, // TokenId
              priceN * 1e6, // ListPrice
              Number.MAX_SAFE_INTEGER, // EndTime
              Math.min(nft?.royalties?.royaltyPoints || 0, 9500), // RoyaltyPoints
              nft?.royalties?.creator1Points || 0, // CreatePoints1
              nft?.royalties?.creator2Points || 0, // CreatePoints1
              nft?.royalties?.creator3Points || 0, // CreatePoints1
              nft?.royalties?.creator1Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ", // CreatePoints1
              nft?.royalties?.creator2Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ", // CreatePoints1
              nft?.royalties?.creator3Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ" // CreatePoints1
            ),
            builder.arc72.arc72_approve(
              algosdk.getApplicationAddress(ctcInfoMp206), // Address
              tokenId // TokenId
            ),
          ])
        ).map(({ obj }) => obj);
        ci.setAccounts([
          "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ", // mp206 D
        ]);
        ci.setFee(2000);
        ci.setPaymentAmount(
          customPaymentAmount.reduce((acc, val) => acc + val, 0)
        );
        ci.setExtraTxns(customTxns);
        const customR = await ci.custom();
        if (!customR.success) {
          throw new Error("failed in simulate");
        }
        await signTransactions(
          customR.txns.map(
            (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
          )
        ).then(sendTransactions);
      } else {
        const customPaymentAmount = [ListingBoxCost];
        const customTxns = (
          await Promise.all([
            builder.mp.a_sale_listSC(
              contractId,
              tokenId,
              currencyN,
              priceN * 1e6,
              Number.MAX_SAFE_INTEGER,
              Math.min(nft?.royalties?.royaltyPoints || 0, 9500), // RoyaltyPoints
              nft?.royalties?.creator1Points || 0, // CreatePoints1
              nft?.royalties?.creator2Points || 0, // CreatePoints1
              nft?.royalties?.creator3Points || 0, // CreatePoints1
              nft?.royalties?.creator1Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ", // CreatePoints1
              nft?.royalties?.creator2Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ", // CreatePoints1
              nft?.royalties?.creator3Address ||
                "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ" // CreatePoints1
            ),
            builder.arc72.arc72_approve(
              algosdk.getApplicationAddress(ctcInfoMp206),
              tokenId
            ),
          ])
        ).map(({ obj }) => obj);
        ci.setAccounts([
          "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ",
        ]);
        ci.setFee(2000);
        ci.setExtraTxns(customTxns);
        ci.setPaymentAmount(
          customPaymentAmount.reduce((acc, val) => acc + val, 0)
        );
        const customR = await ci.custom();
        console.log(customR);
        if (!customR.success) {
          throw new Error("failed in simulate");
        }
        await signTransactions(
          customR.txns.map(
            (txn: string) => new Uint8Array(Buffer.from(txn, "base64"))
          )
        ).then(sendTransactions);
      }
      toast("List successful!");
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setIsListing(false);
      setOpenListSale(false);
      setSelected(-1);
    }
  };
  const handleDeleteListing = async (listingId: number) => {
    try {
      const ci = new CONTRACT(
        ctcInfoMp206,
        getAlgorandClients().algodClient,
        getAlgorandClients().indexerClient,
        {
          name: "",
          desc: "",
          methods: [
            {
              name: "a_sale_deleteListing",
              args: [
                {
                  type: "uint256",
                  name: "listingId",
                },
              ],
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
      ci.setFee(3000);
      const a_sale_deleteListingR = await ci.a_sale_deleteListing(listingId);
      if (!a_sale_deleteListingR.success) {
        throw new Error("a_sale_deleteListing failed in simulate");
      }
      const txns = a_sale_deleteListingR.txns;
      await signTransactions(
        txns.map((txn: string) => new Uint8Array(Buffer.from(txn, "base64")))
      ).then(sendTransactions);
      toast.success("Unlist successful!");
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setSelected2(-1);
    }
  };
  const handleTransfer = async (addr: string, amount: string) => {
    try {
      const amountN = Number(amount);
      // TODO validate address
      if (!addr) {
        throw new Error("Address is required");
      }
      if (isNaN(amountN)) {
        throw new Error("Invalid amount");
      }
      if (!activeAccount) {
        throw new Error("No active account");
      }
      setIsTransferring(true);
      const nft: any = nfts[selected];
      const { contractId, tokenId } = nft;
      const { algodClient, indexerClient } = getAlgorandClients();
      const ci = new arc72(contractId, algodClient, indexerClient, {
        acc: { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
      });
      const builder: any = {
        arc72: new CONTRACT(
          contractId,
          algodClient,
          indexerClient,
          abi.arc72,
          { addr: activeAccount?.address || "", sk: new Uint8Array(0) },
          undefined,
          undefined,
          true
        ),
      };
      const arc72_ownerOfR = await ci.arc72_ownerOf(tokenId);
      if (!arc72_ownerOfR.success) {
        throw new Error("arc72_ownerOf failed in simulate");
      }
      const arc72_ownerOf = arc72_ownerOfR.returnValue;
      //if (arc72_ownerOf !== activeAccount?.address) {
      //  throw new Error("arc72_ownerOf not connected");
      //}
      const customTxn = (
        await Promise.all([
          builder.arc72.arc72_transferFrom(
            activeAccount?.address || "",
            addr,
            BigInt(tokenId)
          ),
        ])
      ).map(({ obj }) => obj);
      const ciCustom = new CONTRACT(
        contractId,
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
        { addr: activeAccount?.address || "", sk: new Uint8Array(0) }
      );
      ciCustom.setExtraTxns(customTxn);
      // ------------------------------------------
      // Add payment if necessary
      //   Aust arc72 pays for the box cost if the ctcAddr balance - minBalance < box cost
      const BalanceBoxCost = 28500;
      const accInfo = await algodClient
        .accountInformation(algosdk.getApplicationAddress(contractId))
        .do();
      const availableBalance = accInfo.amount - accInfo["min-balance"];
      const extraPaymentAmount =
        availableBalance < BalanceBoxCost
          ? BalanceBoxCost // Pay whole box cost instead of partial cost, BalanceBoxCost - availableBalance
          : 0;
      ciCustom.setPaymentAmount(extraPaymentAmount);
      const transfers = [];
      if (amountN > 0) {
        transfers.push([Math.floor(amountN * 1e6), addr]);
      }
      ciCustom.setTransfers(transfers);
      // ------------------------------------------
      const customR = await ciCustom.custom();
      if (!customR.success) {
        throw new Error("custom failed in simulate");
      }
      const txns = customR.txns;
      const res = await signTransactions(
        txns.map((txn: string) => new Uint8Array(Buffer.from(txn, "base64")))
      ).then(sendTransactions);
      toast.success(`NFT Transfer successful!`);
      if (connectedAccounts.map((a) => a.address).includes(addr)) {
        setNfts([
          ...nfts.slice(0, selected),
          { ...nft, owner: addr },
          ...nfts.slice(selected + 1),
        ]);
      } else {
        setNfts([...nfts.slice(0, selected), ...nfts.slice(selected + 1)]);
      }
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setIsTransferring(false);
      setOpen(false);
      setSelected(-1);
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
                    // background:
                    //   selected >= 0 && nfts[selected]?.owner === id
                    //     ? "rgba(139, 44, 195, 0.1)"
                    //     : undefined,
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
        <ButtonGroup>
          {["Collected", "Listed"].map((el: string, i: number) => (
            <Button
              variant={i === activeTab ? "contained" : "outlined"}
              onClick={() => {
                setActiveTab(i);
              }}
            >
              {el}
            </Button>
          ))}
        </ButtonGroup>
        {activeTab === 0 ? (
          <>
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
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={() => setOpenListSale(true)}
                    >
                      List For Sale
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={async () => {
                        const ci = new arc72(
                          nfts[selected].contractId,
                          getAlgorandClients().algodClient,
                          getAlgorandClients().indexerClient,
                          {
                            acc: {
                              addr: activeAccount?.address || "",
                              sk: new Uint8Array(0),
                            },
                          }
                        );
                        const arc72_ownerOfR = await ci.arc72_ownerOf(
                          nfts[selected].tokenId
                        );
                        console.log({ arc72_ownerOfR });
                        setOpen(true);
                      }}
                    >
                      Transfer
                    </Button>
                    <Link
                      to={`https://nftnavigator.xyz/collection/${nfts[selected].contractId}/token/${nfts[selected].tokenId}`}
                      target="_blank"
                    >
                      <Button size="large">View in NFT Navigator</Button>
                    </Link>
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
          </>
        ) : null}
        {activeTab === 1 ? (
          <>
            <Typography variant="h4" sx={{ mt: 3 }}>
              Listed <small>{listed.length}</small>
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
              {selected2 >= 0 ? (
                <>
                  <ButtonGroup>
                    <Button
                      onClick={() => {
                        navigate(
                          `/collection/${listed[selected2].cId}/token/${listed[selected2].tId}`
                        );
                      }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => {
                        handleDeleteListing(listed[selected2].lId);
                      }}
                    >
                      Unlist
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
              {listed.map((listing: any, index: number) => {
                const nft = nfts.find(
                  (el: any) =>
                    el.contractId === Number(listing.cId) &&
                    el.tokenId === Number(listing.tId)
                );
                return (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={nft.id}>
                    <img
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: 10,
                        border:
                          selected2 === index
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
                            setSelected2(-1);
                          } else {
                            setSelected2(index);
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
          </>
        ) : null}

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
      <TransferModal
        title="Transfer NFT"
        loading={isTransferring}
        open={open}
        handleClose={() => setOpen(false)}
        onSave={handleTransfer}
      />
      <ListSaleModal
        image={nfts[selected]?.metadata.image}
        title="List NFT for Sale"
        loading={isListing}
        open={openListSale}
        handleClose={() => setOpenListSale(false)}
        onSave={handleListSale}
        royalties={nfts[selected]?.royalties.royaltyPercent || 0 + 5}
      />
    </Layout>
  );
};
