export interface Post {
  id?: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface PostState {
  posts: Post[];
  isLoading: boolean;
}