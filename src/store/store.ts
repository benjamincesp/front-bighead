import { configureStore } from "@reduxjs/toolkit";
import {postSlice} from "./postStore/postSlice";


export const store = configureStore({
  reducer: {
    post: postSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;