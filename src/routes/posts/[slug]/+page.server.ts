import { error } from '@sveltejs/kit';
import { createSupabaseServerClient } from '$lib/supabase.server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
  const supabase = createSupabaseServerClient(cookies);
  
  const { data: post, error: dbError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', params.slug)
    .single();
    
  if (dbError || !post || !post.published) {
    throw error(404, 'Post no encontrado');
  }
  
  return { post };
};
