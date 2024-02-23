import React from "react";
import Layout from "../../layouts/Default";
import Section from "../../components/Section";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

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
  /* Router */
  const navigate = useNavigate();
  /* Theme */
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  /* NFT Navigator */
  const [collections, setCollections] = React.useState<any>([]);
  React.useEffect(() => {
    try {
      (async () => {
        const {
          data: { collections: res },
        } = await axios.get(
          "https://arc72-idx.voirewards.com/nft-indexer/v1/collections"
        );
        const collections = [];
        for (const c of res) {
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
  }, []);
  const [nfts, setNfts] = React.useState<any>([]);
  React.useEffect(() => {
    try {
      (async () => {
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens`
        );
        const nfts = [];
        for (const t of res) {
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
  }, []);
  return (
    <Layout>
      <Section title="Trending Collections">
        <Grid container spacing={2}>
          {collections.slice(0, 4).map((el: any) => {
            return (
              <Grid item xs={6} sm={4} md={3}>
                <img
                  style={{ width: "100%", cursor: "pointer", borderRadius: 10 }}
                  src={el.metadata.image}
                  alt={el.metadata.name}
                  onClick={() => navigate(`/collection/${el.contractId}`)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Section>
      <Section title="Recently Listed">
        <Grid container spacing={3} sx={{ justifyContent: "space-evenly" }}>
          {nfts.slice(0, 24).map((el: any) => {
            console.log({ el });
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
                  onClick={() =>
                    navigate(`/collection/${el.contractId}/token/${el.tokenId}`)
                  }
                />
              </Grid>
            );
          })}
        </Grid>
      </Section>
    </Layout>
  );
};
