import React from "react";
import Layout from "../../layouts/Default";
import Section from "../../components/Section";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import { MarketplaceContext } from "../../store/MarketplaceContext";
import NftCard from "../../components/NFTCard";
import { decodePrice, decodeTokenId } from "../../utils/mp";

function shuffleArray<T>(array: T[]): T[] {
  // Create a copy of the original array to avoid mutating the original array
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const randomIndex = Math.floor(Math.random() * (i + 1));
    // Swap elements between randomIndex and i
    [shuffledArray[i], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
}

export const Home: React.FC = () => {
  /* Marketplace */
  const { forSale } = React.useContext(MarketplaceContext);
  console.log({ forSale });
  /* Router */
  const navigate = useNavigate();
  /* Theme */
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  /* NFT Navigator Collections */
  const [collections, setCollections] = React.useState<any>([]);
  React.useEffect(() => {
    if (!forSale) return;
    try {
      (async () => {
        const {
          data: { collections: res },
        } = await axios.get(
          "https://arc72-idx.voirewards.com/nft-indexer/v1/collections"
        );
        const collections = [];
        for (const c of res) {
          if (
            !forSale.map((el: any) => Number(el.cId)).includes(c.contractId)
          ) {
            continue;
          }
          const t = c.firstToken;
          if (!!t) {
            const tm = JSON.parse(t.metadata);
            collections.push({
              ...t,
              metadata: tm,
            });
          }
        }
        setCollections(shuffleArray(collections));
      })();
    } catch (e) {
      console.log(e);
    }
  }, [forSale]);
  /* NFT Navigator NFTs */
  const [nfts, setNfts] = React.useState<any>([]);
  React.useEffect(() => {
    if (!forSale) return;
    try {
      (async () => {
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens`
        );
        const nfts = [];
        for (const t of res) {
          if (
            !forSale
              .map((el: any) => [Number(el.cId), Number(el.tId)].join(":"))
              .includes(`${t.contractId}:${t.tokenId}`)
          ) {
            continue;
          }
          const tm = JSON.parse(t.metadata);
          nfts.push({
            ...t,
            metadata: tm,
          });
        }
        setNfts(shuffleArray(nfts));
      })();
    } catch (e) {
      console.log(e);
    }
  }, [forSale]);
  return (
    <Layout>
      <Section title="Collections">
        {collections.length > 0 ? (
          <Grid container spacing={2}>
            {collections.slice(0, 16).map((el: any) => {
              return (
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <img
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      borderRadius: 10,
                    }}
                    src={el.metadata.image}
                    alt={el.metadata.name}
                    onClick={() => navigate(`/collection/${el.contractId}`)}
                  />
                </Grid>
              );
            })}
          </Grid>
        ) : (
          "No collections available for sale."
        )}
      </Section>
      <Section title="Recently Listed">
        {nfts.length > 0 ? (
          <Grid container spacing={2}>
            {nfts.slice(0, 24).map((el: any) => {
              const listing = forSale.find(
                (l: any) =>
                  Number(l.cId) === el.contractId &&
                  Number(l.tId) === el.tokenId
              );
              return (
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  {/*<img
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    borderRadius: 10,
                  }}
                  src={el.metadata.image}
                  alt={el.metadata.name}
                  onClick={() =>
                    navigate(`/collection/${el.contractId}/token/${el.tokenId}`)
                  }
                />*/}
                  {listing ? (
                    <NftCard
                      nftName={el.metadata.name}
                      image={el.metadata.image}
                      owner={el.owner}
                      price={`${(decodePrice(listing.lPrc) || 0) / 1e6} ${
                        decodeTokenId(listing.lPrc) === 0 ? "VOI" : "VIA"
                      }`}
                      onClick={() =>
                        navigate(
                          `/collection/${el.contractId}/token/${el.tokenId}`
                        )
                      }
                    />
                  ) : null}
                </Grid>
              );
            })}
          </Grid>
        ) : (
          "No NFTs available for sale."
        )}
      </Section>
    </Layout>
  );
};
