import React, { useEffect, useMemo } from "react";
import Layout from "../../layouts/Default";
import { Container, Grid, Stack, Typography } from "@mui/material";
import NFTCard from "../../components/NFTCard";
import Section from "../../components/Section";
import { nfts } from "../../static/json/nfts";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import styled from "styled-components";
import { getTokens } from "../../store/tokenSlice";
import { UnknownAction } from "@reduxjs/toolkit";
import { getCollections } from "../../store/collectionSlice";
import { getSales } from "../../store/saleSlice";
import { getRankings } from "../../utils/mp";
import NFTCollectionTable from "../../components/NFTCollectionTable";

const SectionHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 45px;
  gap: 10px;
  & h2.dark {
    color: #fff;
  }
  & h2.light {
    color: #93f;
  }
`;

const SectionDescription = styled.div`
  flex: 1 0 0;
  color: #93f;
  font-family: "Advent Pro";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 120% */
  letter-spacing: 0.2px;
`;

const SectionTitle = styled.h2`
  /*color: #93f;*/
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

export const Collections: React.FC = () => {
  /* Dispatch */
  const dispatch = useDispatch();
  /* Tokens */
  const tokens = useSelector((state: any) => state.tokens.tokens);
  const tokenStatus = useSelector((state: any) => state.tokens.status);
  useEffect(() => {
    dispatch(getTokens() as unknown as UnknownAction);
  }, [dispatch]);

  /* Collections */
  const collections = useSelector(
    (state: any) => state.collections.collections
  );
  const collectionStatus = useSelector(
    (state: any) => state.collections.status
  );
  useEffect(() => {
    dispatch(getCollections() as unknown as UnknownAction);
  }, [dispatch]);
  /* Sales */
  const sales = useSelector((state: any) => state.sales.sales);
  const salesStatus = useSelector((state: any) => state.sales.status);
  useEffect(() => {
    dispatch(getSales() as unknown as UnknownAction);
  }, [dispatch]);
  /* Theme */
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );

  /* NFT Navigator Listings */
  const [listings, setListings] = React.useState<any>(null);
  React.useEffect(() => {
    try {
      const res = axios
        .get("https://arc72-idx.nftnavigator.xyz/nft-indexer/v1/mp/listings", {
          params: {
            active: true,
          },
        })
        .then(({ data }) => {
          setListings(data.listings);
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  const rankings: any = useMemo(() => {
    if (
      !tokens ||
      !sales ||
      !listings ||
      tokenStatus !== "succeeded" ||
      salesStatus !== "succeeded" ||
      collectionStatus !== "succeeded"
    )
      return new Map();
    return getRankings(tokens, collections, sales, listings);
  }, [sales, tokens, collections, listings]);

  console.log({ rankings, sales, tokens, collections, listings });

  const isLoading = useMemo(
    () =>
      !listings ||
      !rankings ||
      tokenStatus !== "succeeded" ||
      collectionStatus !== "succeeded" ||
      salesStatus !== "succeeded",
    [tokens, listings, rankings, tokenStatus, collectionStatus, salesStatus]
  );

  return !isLoading ? (
    <Layout>
      <Container maxWidth="xl">
        <SectionHeading>
          <SectionTitle className={isDarkTheme ? "dark" : "light"}>
            Collections
          </SectionTitle>
          <SectionDescription>// {rankings.length} results</SectionDescription>
        </SectionHeading>
        <NFTCollectionTable rankings={rankings} />
      </Container>
    </Layout>
  ) : null;
};
