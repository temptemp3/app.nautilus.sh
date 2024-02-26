import React, { useEffect } from "react";
import { WalletProvider, useInitializeProviders } from "@txnlab/use-wallet";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Navbar from "./components/Navbar";
import { routes } from "./routes";
import { getAlgorandClients, getProviderInit } from "./wallets";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { mpDb } from "./db";
import { ctcInfoMp206 } from "./contants/mp";
import { CONTRACT } from "ulujs";
import { MarketplaceProvider } from "./store/MarketplaceProvider";

const App: React.FC = () => {
  const providers = useInitializeProviders(getProviderInit());
  const [currentRound, setCurrentRound] = React.useState(0);
  const { algodClient, indexerClient } = getAlgorandClients();
  useEffect(() => {
    algodClient
      .status()
      .do()
      .then((s) => {
        setCurrentRound(s["last-round"]);
      });
  }, []);
  useEffect(() => {
    if (!currentRound) return;
    (async () => {
      const mp = ctcInfoMp206;
      const lsKey = `mp-${mp}-last-round`;
      const lastRound = localStorage.getItem(lsKey);
      const ci = new CONTRACT(
        mp,
        algodClient,
        indexerClient,
        {
          name: "",
          desc: "",
          methods: [],
          events: [
            {
              name: "e_sale_ListEvent",
              args: [
                {
                  type: "uint256",
                },
                {
                  type: "uint64",
                },
                {
                  type: "uint256",
                },
                {
                  type: "address",
                },
                {
                  type: "(byte,byte[40])",
                },
                {
                  type: "uint64",
                },
                {
                  type: "uint64",
                },
              ],
            },
            {
              name: "e_sale_BuyEvent",
              args: [
                {
                  type: "uint256",
                },
                {
                  type: "address",
                },
              ],
            },
            {
              name: "e_sale_ClaimEvent",
              args: [
                {
                  type: "uint256",
                },
              ],
            },
            {
              name: "e_sale_DeleteListingEvent",
              args: [
                {
                  type: "uint256",
                },
              ],
            },
          ],
        },
        {
          addr: "G3MSA75OZEJTCCENOJDLDJK7UD7E2K5DNC7FVHCNOV7E3I4DTXTOWDUIFQ",
          sk: new Uint8Array(0),
        }
      );
      const evts = await ci.getEvents({
        minRound: lastRound ? parseInt(lastRound) : 0,
      });
      const listings = evts.find(
        (el: any) => el.name === "e_sale_ListEvent"
      ).events;
      const buys = evts.find((el: any) => el.name === "e_sale_BuyEvent").events;
      const claims = evts.find(
        (el: any) => el.name === "e_sale_ClaimEvent"
      ).events;
      const deletions = evts.find(
        (el: any) => el.name === "e_sale_DeleteListingEvent"
      ).events;
      await Promise.allSettled([
        ...listings.map((el: any) => {
          const [txId, round, ts, lId, cId, tId, lAddr, lPrc, endT, roy] = el;
          const pk = `voi:${mp}:${lId}`;
          const listing = {
            pk,
            mp,
            txId,
            round,
            timestamp: ts,
            lId,
            cId,
            tId,
            lAddr,
            lPrc,
            endT,
            roy,
          };
          return mpDb.table("listings").put(listing, pk);
        }),
        ...buys.map((el: any) => {
          const [txId, round, ts, lId, bAddr] = el;
          const pk = `voi:${mp}:${lId}`;
          const sale = {
            pk,
            mp,
            txId,
            round,
            timestamp: ts,
            lId,
            bAddr,
          };
          return mpDb.table("sales").put(sale, pk);
        }),
        ...claims.map((el: any) => {
          const [txId, round, ts, lId] = el;
          const pk = `voi:${mp}:${lId}`;
          const claim = {
            pk,
            mp,
            txId,
            round,
            timestamp: ts,
            lId,
          };
          return mpDb.table("claims").put(claim, pk);
        }),
        ...deletions.map((el: any) => {
          const [txId, round, ts, lId] = el;
          const pk = `voi:${mp}:${lId}`;
          const deletion = {
            pk,
            mp,
            txId,
            round,
            timestamp: ts,
            lId,
          };
          return mpDb.table("deletions").put(deletion, pk);
        }),
      ]);
      localStorage.setItem(lsKey, currentRound.toString());
    })();
  }, [currentRound]);
  return (
    <WalletProvider value={providers}>
      <MarketplaceProvider>
        <Provider store={store}>
          <Router>
            <Navbar />
            <Routes>
              {routes.map((el) => (
                <Route path={el.path} Component={el.Component} />
              ))}
            </Routes>
          </Router>
        </Provider>
        <ToastContainer />
      </MarketplaceProvider>
    </WalletProvider>
  );
};

export default App;
