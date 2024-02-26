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
import styled from "styled-components";

const SectinoHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 45px;
`;

const SectionTitle = styled.h2`
  color: #93f;
  text-align: center;
  leading-trim: both;
  text-edge: cap;
  font-feature-settings: "clig" off, "liga" off;
  font-family: Nohemi;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 100%; /* 40px */
`;

const SectionMoreButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const SectionMoreButton = styled.button`
  /* Layout */
  display: flex;
  padding: 12px 20px;
  justify-content: center;
  align-items: center;
  gap: 6px;
  /* Style */
  border-radius: 100px;
  border: 1px solid #93f;
  /* Shadow/XSM */
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.04);
  /* Style/Extra */
  background-color: transparent;
  &::after {
    content: "";
    width: 20px;
    height: 20px;
    background: url("/arrow-narrow-up-right.svg") no-repeat;
    position: relative;
    display: inline-block;
  }
`;

const SectionMoreButtonText = styled.div`
  color: #93f;
  /* Text Button/Semibold Large */
  font-family: "Inter", sans-serif;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px; /* 146.667% */
  letter-spacing: 0.1px;
`;

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
      <SectinoHeading>
        <SectionTitle>New Listings</SectionTitle>
        <SectionMoreButtonContainer>
          <SectionMoreButton>
            <SectionMoreButtonText>View All</SectionMoreButtonText>
          </SectionMoreButton>
        </SectionMoreButtonContainer>
      </SectinoHeading>
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
