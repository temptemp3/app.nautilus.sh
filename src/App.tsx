import React from "react";
import {
  WalletProvider,
  useInitializeProviders,
  PROVIDER_ID,
} from "@txnlab/use-wallet";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import { Provider } from "react-redux";
import store from "./store/store";
import ThemeSelector from "./components/ThemeSelector";

import * as Page from "./pages";
import Navbar from "./components/Navbar";
import Layout from "./layouts/Default";

const getDynamicDeflyWalletConnect = async () => {
  const DeflyWalletConnect = (await import("@blockshake/defly-connect"))
    .DeflyWalletConnect;
  return DeflyWalletConnect;
};

const getDynamicPeraWalletConnect = async () => {
  const PeraWalletConnect = (await import("@perawallet/connect"))
    .PeraWalletConnect;
  return PeraWalletConnect;
};

const getDynamicDaffiWalletConnect = async () => {
  const DaffiWalletConnect = (await import("@daffiwallet/connect"))
    .DaffiWalletConnect;
  return DaffiWalletConnect;
};

const getDynamicLuteConnect = async () => {
  const LuteConnect = (await import("lute-connect")).default;
  return LuteConnect;
};

const App: React.FC = () => {
  const providers = useInitializeProviders({
    providers: [
      { id: PROVIDER_ID.DEFLY, getDynamicClient: getDynamicDeflyWalletConnect },
      //{ id: PROVIDER_ID.PERA, getDynamicClient: getDynamicPeraWalletConnect },
      //{ id: PROVIDER_ID.DAFFI, getDynamicClient: getDynamicDaffiWalletConnect },
      //{ id: PROVIDER_ID.EXODUS },
      {
        id: PROVIDER_ID.LUTE,
        getDynamicClient: getDynamicLuteConnect,
        clientOptions: { siteName: "Nautilus" },
      },
      { id: PROVIDER_ID.KIBISIS },
    ],
  });
  const routes = [
    {
      path: "/",
      Component: Page.Home,
    },
    {
      path: "/collection",
      Component: Page.Collections,
    },
    {
      path: "/collection/:id",
      Component: Page.Collection,
    },
    {
      path: "/collection/:id/token/:tid",
      Component: Page.Token,
    },
    {
      path: "/sandbox",
      Component: Page.Sandbox,
    },
  ];
  return (
    <WalletProvider value={providers}>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            {routes.map((el) => (
              <Route path={el.path} Component={el.Component} />
            ))}
            <Route path="/" Component={Page.Home} />
            <Route path="/collection" Component={Page.Collections} />
            <Route path="/sandbox" Component={Page.Sandbox} />
          </Routes>
        </Router>
      </Provider>
    </WalletProvider>
  );
};

export default App;
