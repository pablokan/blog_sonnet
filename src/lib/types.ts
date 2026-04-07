export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_url?: string;
  published: boolean;
}
