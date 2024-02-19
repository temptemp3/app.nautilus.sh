import React from "react";
import Layout from "../../layouts/Default";
import Carousel from "../../components/Carousel";
import Top from "../../components/Top";
import List from "../../components/List";
import Section from "../../components/Section";

export const Home: React.FC = () => {
  return (
    <Layout>
      <Carousel />
      <Section title="Top">
        <Top />
      </Section>
      <Section title="Trending Now">&nbsp;</Section>
      <Section title="Notable Collections">&nbsp;</Section>
      <Section title="Activity">&nbsp;</Section>
      <footer>Footer</footer>
    </Layout>
  );
};
