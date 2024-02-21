import React from "react";
import Layout from "../../layouts/Default";
import { Grid } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import Section from "../../components/Section";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";

export const Collection: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  const [nfts, setNfts] = React.useState<any>([]);
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
        setNfts(nfts);
      })();
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <Layout>
      {nfts.length > 0 ? (
        <Section title={nfts[0].metadata.name.replace(/[#0123456789 ]*$/, "")}>
          <Grid container spacing={3}>
            {nfts.map((el: any) => {
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
        </Section>
      ) : null}
    </Layout>
  );
};
