import React from "react";
import Layout from "../../layouts/Default";
import { Grid } from "@mui/material";
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
      <Section title="Collections">
        <Grid container spacing={3}>
          {collections.map((el: any) => {
            return (
              <Grid item>
                <NFTCard
                  nftName={el.metadata.name.replace(/[#123456789 ]*$/, "")}
                  image={el.metadata.image}
                  price="123,000 VOI"
                  owner={""}
                  onClick={() => {
                    navigate(`/collection/${el.contractId}`);
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
