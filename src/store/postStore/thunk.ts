import { Post } from "./interfaces";
import { deletePost, getPosts, startLoading, stopLoading } from "./postSlice";

// export const fetchPosts = (): any => {
//   return async (dispatch: any) => {
//     try {
//       dispatch(startLoading());
//       const postService = new PostService();
//       const posts = await postService.getPosts();
//       dispatch(getPosts(posts));
//     } catch (error: any) {
//       console.error(error);
//     } finally {
//       dispatch(stopLoading());
//     }
//   };
// };

// export const removePost = (id: number): any => {
//   return async (dispatch: any) => {
//     try {
//       dispatch(startLoading());
//       const postService = new PostService();
//       await postService.deletePost(id);
//       dispatch(deletePost(id));
//       dispatch(fetchPosts());
//     } catch (error: any) {
//       console.error(error);
//     } finally {
//       dispatch(stopLoading());
//     }
//   };
// };

// export const createNewPost = (post: Post):any => {
//   return async (dispatch: any) => {
//     try {
//       dispatch(startLoading());
//       const postService = new PostService();
//       await postService.createPost(post);
//       dispatch(fetchPosts());
//     } catch (error: any) {
//       console.error(error);
//     } finally {
//       dispatch(stopLoading());
//     }
//   };
// };