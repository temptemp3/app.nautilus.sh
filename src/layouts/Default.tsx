import React from "react";
import Navbar from "../components/Navbar";
import styled from "styled-components";

const LayoutRoot = styled.div`
  padding: 0px 80px;
  @media (max-width: 600px) {
    padding: 0px 10px;
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutRoot>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </LayoutRoot>
  );
};

export default Layout;
