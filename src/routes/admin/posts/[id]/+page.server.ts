import { fail, redirect, error } from '@sveltejs/kit';
import { createSupabaseAdminClient } from '$lib/supabase.server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const supabase = createSupabaseAdminClient();
  const { data: post, error: dbError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .single();

  if (dbError || !post) {
    throw error(404, 'Post no encontrado');
  }

  return { post };
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    const slug = data.get('slug') as string;
    const excerpt = data.get('excerpt') as string;
    const content = data.get('content') as string;
    const cover_url = data.get('cover_url') as string;
    const published = data.get('published') === 'true';

    if (!title || !slug || !content) {
      return fail(400, { error: 'El título, slug y contenido son obligatorios' });
    }

    const supabase = createSupabaseAdminClient();
    const { error: updateError } = await supabase
      .from('posts')
      .update({ title, slug, excerpt, content, cover_url, published })
      .eq('id', params.id);

    if (updateError) {
      return fail(500, { error: updateError.message });
    }

    redirect(303, '/admin/posts');
  }
};
