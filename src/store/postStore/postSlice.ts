import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, PostState } from "./interfaces";

const initialState: PostState & { filter: string; filteredPosts: Post[] } = {
  posts: [],
  filteredPosts: [],
  isLoading: false,
  filter: "",
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    getPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
      state.filteredPosts = action.payload;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    deletePost: (state, action: PayloadAction<number>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
      state.filteredPosts = state.filteredPosts.filter(post => post.id !== action.payload);
    },
    createPost: (state, action: PayloadAction<Post>) => {
      state.posts = [action.payload, ...state.posts];
      state.filteredPosts = [action.payload, ...state.filteredPosts];
    },
    filterPostsByName: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
      state.filteredPosts = state.posts.filter(post =>
        post.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
  },
});

export const {
  getPosts,
  deletePost,
  startLoading,
  stopLoading,
  createPost,
  filterPostsByName,
} = postSlice.actions;

export default postSlice.reducer;