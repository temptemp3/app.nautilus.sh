// import React, { useMemo, FC, ReactNode } from "react";
// import { mpDb } from "../db";
// import { useLiveQuery } from "dexie-react-hooks";
// import { decodePrice, decodeTokenId } from "../utils/mp";
// import {
//   MarketplaceContext,
//   MarketplaceContextType,
// } from "./MarketplaceContext";

// const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const dbMpListings = useLiveQuery(() => mpDb.table("listings").toArray());
//   const dbMpSales = useLiveQuery(() => mpDb.table("sales").toArray());
//   const dbMpDeletions = useLiveQuery(() => mpDb.table("deletions").toArray());
//   const isLoading = React.useMemo(
//     () => !dbMpListings || !dbMpSales,
//     [dbMpListings, dbMpSales]
//   );
//   const listings = React.useMemo(() => {
//     if (!dbMpListings) return [];
//     return dbMpListings;
//   }, [dbMpListings]);
//   const sales = React.useMemo(() => {
//     if (!dbMpSales) return [];
//     return dbMpSales;
//   }, [dbMpSales]);
//   const deletions = React.useMemo(() => {
//     if (!dbMpDeletions) return [];
//     return dbMpDeletions;
//   }, [dbMpDeletions]);
//   const forSale = React.useMemo(() => {
//     if (isLoading) return [];
//     return listings
//       .filter((listing) => {
//         return (
//           sales.every((sale) => sale.lId !== listing.lId) &&
//           deletions.every((deletion) => deletion.lId !== listing.lId)
//         );
//       })
//       .map((listing) => {
//         const tokenId = decodeTokenId(listing.lPrc);
//         const payment = decodePrice(listing.lPrc);
//         return {
//           ...listing,
//           tokenId,
//           payment,
//         };
//       })
//       .sort((a, b) => b.timestamp - a.timestamp);
//   }, [isLoading, listings, sales, deletions]);

//   const contextValue: MarketplaceContextType = {
//     isLoading,
//     listings,
//     forSale,
//   };

//   return (
//     <MarketplaceContext.Provider value={contextValue}>
//       {children}
//     </MarketplaceContext.Provider>
//   );
// };

// export { MarketplaceContext, MarketplaceProvider };
