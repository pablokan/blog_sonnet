import { createSupabaseServerClient } from '$lib/supabase.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching posts:', error);
  }
  
  return {
    posts: posts || []
  };
};
