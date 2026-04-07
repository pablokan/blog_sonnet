import { fail, redirect } from '@sveltejs/kit';
import { createSupabaseAdminClient } from '$lib/supabase.server';
import { slugify } from '$lib/utils';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {};
};

export const actions: Actions = {
  create: async ({ request }) => {
    const data = await request.formData();
    const title = data.get('title') as string;
    let slug = data.get('slug') as string;
    const excerpt = data.get('excerpt') as string;
    const content = data.get('content') as string;
    const cover_url = data.get('cover_url') as string;
    const published = data.get('published') === 'true';

    if (!title || !content) {
      return fail(400, { error: 'El título y el contenido son obligatorios', title, slug, excerpt, content, cover_url });
    }

    if (!slug) {
      slug = slugify(title);
    }

    const supabase = createSupabaseAdminClient();
    const { data: newPost, error } = await supabase
      .from('posts')
      .insert({ title, slug, excerpt, content, cover_url, published })
      .select('id')
      .single();

    if (error) {
      return fail(500, { error: error.message, title, slug, excerpt, content, cover_url });
    }

    redirect(303, `/admin/posts`);
  }
};
