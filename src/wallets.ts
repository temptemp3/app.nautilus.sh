import { PROVIDER_ID } from "@txnlab/use-wallet";
import algosdk from "algosdk";

const getDynamicDeflyWalletConnect = async () => {
  const DeflyWalletConnect = (await import("@blockshake/defly-connect"))
    .DeflyWalletConnect;
  return DeflyWalletConnect;
};

// const getDynamicPeraWalletConnect = async () => {
//   const PeraWalletConnect = (await import("@perawallet/connect"))
//     .PeraWalletConnect;
//   return PeraWalletConnect;
// };

// const getDynamicDaffiWalletConnect = async () => {
//   const DaffiWalletConnect = (await import("@daffiwallet/connect"))
//     .DaffiWalletConnect;
//   return DaffiWalletConnect;
// };

const getDynamicLuteConnect = async () => {
  const LuteConnect = (await import("lute-connect")).default;
  return LuteConnect;
};

export const getProviderInit: any = () => ({
  // providers
  //  algorand
  //  algorand-testnet
  //    pera
  //    daffi
  //    exodus
  //    defly
  //    kibisis
  //  voi-testnet
  //    defly (A-Wallet)
  //    kibisis
  //    lute
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
  nodeConfig: {
    network: "voi-testnet",
    nodeServer: "https://testnet-api.voi.nodly.io",
    nodeToken: "",
    nodePort: "443",
  },
  algosdkStatic: algosdk,
  debug: true,
});
