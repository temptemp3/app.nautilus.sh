import { configureStore } from "@reduxjs/toolkit";
import themeReducer, { ThemeState } from "./themeSlice";
import tokenReducer, { TokensState } from "./tokenSlice";
import collectionReducer, { CollectionsState } from "./collectionSlice";
import saleReducer, { SalesState } from "./saleSlice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    tokens: tokenReducer,
    collections: collectionReducer,
    sales: saleReducer,
  },
});

export type RootState = {
  tokens: TokensState;
  collections: CollectionsState;
  sales: SalesState;
  theme: ThemeState;
};

export default store;
