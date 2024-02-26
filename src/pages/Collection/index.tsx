import React from "react";
import Layout from "../../layouts/Default";
import { Container, Grid, Typography } from "@mui/material";
import Section from "../../components/Section";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import styled from "styled-components";
import { MarketplaceContext } from "../../store/MarketplaceContext";

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

export const Collection: React.FC = () => {
  /* Marketplace */
  const { forSale } = React.useContext(MarketplaceContext);
  /* Router */
  const { id } = useParams();
  const navigate = useNavigate();
  /* Theme */
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  /* NFT Navigator */
  const [nfts, setNfts] = React.useState<any>([]);
  React.useEffect(() => {
    if (!forSale) return;
    try {
      (async () => {
        const {
          data: { tokens: res },
        } = await axios.get(
          `https://arc72-idx.voirewards.com/nft-indexer/v1/tokens?contractId=${id}`
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
        setNfts(nfts);
      })();
    } catch (e) {
      console.log(e);
    }
  }, [forSale]);
  return (
    <Layout>
      <Container maxWidth="lg">
        {nfts.length > 0 ? (
          <Section
            title={nfts[0].metadata.name.replace(/[#0123456789 ]*$/, "")}
          >
            <Grid container spacing={2}>
              {nfts.map((el: any) => {
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
                        navigate(
                          `/collection/${el.contractId}/token/${el.tokenId}`
                        )
                      }
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Section>
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
              to={`https://nftnavigator.xyz/collection/${id}/`}
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
          <li>
            <StyledLink
              target="_blank"
              to={`https://highforge.io/project/${id}`}
              style={{ color: isDarkTheme ? "#fff" : "#000" }}
            >
              <img
                src="https://highforge.io/apple-touch-icon.png"
                style={{
                  height: "24px",
                  width: "24px",
                  borderRadius: "5px",
                }}
              />{" "}
              High Forge
            </StyledLink>
          </li>
        </ExternalLinks>
      </Container>
    </Layout>
  );
};
