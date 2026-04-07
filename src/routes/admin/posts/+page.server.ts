import { createSupabaseAdminClient } from '$lib/supabase.server';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const supabase = createSupabaseAdminClient();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching admin posts:', error);
  }
  
  return {
    posts: posts || []
  };
};

export const actions: Actions = {
  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get('id');
    
    if (!id) return fail(400, { error: 'ID is required' });
    
    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    
    if (error) {
      return fail(500, { error: error.message });
    }
    
    return { success: true };
  }
};
