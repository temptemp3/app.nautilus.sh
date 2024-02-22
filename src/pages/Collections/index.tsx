import React from "react";
import Layout from "../../layouts/Default";
import { Container, Grid, Typography } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import Section from "../../components/Section";
import { nfts } from "../../static/json/nfts";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

export const Collections: React.FC = () => {
  const navigate = useNavigate();
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
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
        setCollections(collections);
      })();
    } catch (e) {
      console.log(e);
    }
  }, []);
  console.log({ collections });
  return (
    <Layout>
      <Container maxWidth="xl">
        <Section title={`Collections ${collections.length}`}>
          <Grid container spacing={2}>
            {collections.reverse().map((el: any, i: number) => {
              return (
                <Grid
                  key={i}
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  sx={{ overflow: "hidden" }}
                >
                  <img
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    src={el.metadata.image}
                    alt={el.metadata.name}
                    onClick={() => {
                      navigate(`/collection/${el.contractId}`);
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Section>
      </Container>
    </Layout>
  );
};
