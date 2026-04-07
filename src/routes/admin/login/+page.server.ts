import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return fail(401, { error: 'Credenciales incorrectas' });
    }

    // Token simple
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7  // 7 días
    });

    redirect(303, '/admin');
  }
};
