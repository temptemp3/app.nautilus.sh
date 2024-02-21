import React from "react";
import styled from "styled-components";
import LightLogo from "../../static/logo-light.svg";
import DarkLogo from "../../static/logo-dark.svg";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Grid } from "@mui/material";

const FooterRoot = styled.footer`
  position: absolute;
  padding: 64px 80px;
  border-top: 1px solid #eaebf0; /* Border color set to #EAEBF0 */
  padding-bottom: 80px;
  padding-right: 0px;
  padding-left: 80px;
`;

const FooterContainer = styled.div`
  width: 1280px; /* Fill (1,280px) */
  height: fit-content; /* Hug (412px) */
  gap: 64px;
  display: flex;
  flex-direction: column;
`;

const HorizontalContainer = styled.div`
  width: 1280px; /* Fill (1,280px) */
  height: fit-content; /* Hug (292px) */
  display: flex;
  justify-content: space-between; /* Justify: space-between */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content; /* Hug (292px) */
  gap: 16px;
`;

const BrandLogo = styled.img`
  width: 140px;
  height: 28px;
`;

const Description = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 200;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
  color: #68727d;
`;

const FooterHeading = styled.h3`
  font-family: Nohemi;
  font-size: 24px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: left;
`;

const Copyright = styled.div`
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0px;
  text-align: center;
  width: 303px;
  height: 24px;
  color: #68727d;
`;

const FooterLink = styled.li`
  font-family: Inter;
  font-size: 14px;
  font-weight: 300;
  line-height: 20px;
  letter-spacing: 0.10000000149011612px;
  text-align: left;
  color: #68727d;
  margin-top: 12px;
`;

const FooterList = styled.ul`
  padding: 0px;
  list-style: none;
`;

const Footer: React.FC = () => {
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  return (
    <FooterRoot
      style={{ background: isDarkTheme ? "rgb(22, 23, 23)" : undefined }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6}>
          <Container>
            <BrandLogo src={isDarkTheme ? DarkLogo : LightLogo} />
            <Description>
              Join Nautilus and explore the dynamic world of digital art.
              Immerse yourself in a vibrant community of collectors and
              creators. Experience the thrill of discovery today.
            </Description>
          </Container>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <FooterHeading
                style={{
                  color: isDarkTheme ? "white" : undefined,
                }}
              >
                Marketplace
              </FooterHeading>
              <FooterList>
                <FooterLink>Collections</FooterLink>
                <FooterLink>Actions</FooterLink>
                <FooterLink>Buys</FooterLink>
                <FooterLink>Sell</FooterLink>
              </FooterList>
            </Grid>
            <Grid item xs={12} md={6}>
              <FooterHeading
                style={{
                  color: isDarkTheme ? "white" : undefined,
                }}
              >
                Links
              </FooterHeading>
              <FooterList>
                <FooterLink>Privacy Policy</FooterLink>
                <FooterLink>Terms</FooterLink>
                <FooterLink>FAQs</FooterLink>
                <FooterLink>Report a Bug</FooterLink>
              </FooterList>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Copyright>© 2024 Nautilus. All Rights Reserved.</Copyright>
        </Grid>
      </Grid>
    </FooterRoot>
  );
};

export default Footer;
