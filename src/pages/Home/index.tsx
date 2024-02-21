import React from "react";
import Layout from "../../layouts/Default";
import Section from "../../components/Section";
import { Grid } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import { nfts } from "../../static/json/nfts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );

  return (
    <Layout>
      <Section title="Newly Minted">
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {nfts.tokens
            .reverse()
            .slice(0, 4)
            .map((el) => {
              const metadata = JSON.parse(el.metadata);
              return (
                <Grid item>
                  <NFTCard
                    nftName={metadata.name}
                    image={metadata.image}
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
      </Section>
      <Section title="Trending Now">
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {nfts.tokens
            .reverse()
            .slice(0, 4)
            .map((el) => {
              const metadata = JSON.parse(el.metadata);
              return (
                <Grid item>
                  <NFTCard
                    nftName={metadata.name}
                    image={metadata.image}
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
      </Section>
      <Section title="New Collections">
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {nfts.tokens
            .reverse()
            .slice(0, 4)
            .map((el) => {
              const metadata = JSON.parse(el.metadata);
              return (
                <Grid item>
                  <NFTCard
                    nftName={metadata.name}
                    image={metadata.image}
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
      </Section>
      <Section title="Notable Collections">
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {nfts.tokens
            .reverse()
            .slice(0, 4)
            .map((el) => {
              const metadata = JSON.parse(el.metadata);
              return (
                <Grid item>
                  <NFTCard
                    nftName={metadata.name}
                    image={metadata.image}
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
      </Section>
    </Layout>
  );
};
