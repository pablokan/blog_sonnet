import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {};
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('admin_session', { path: '/' });
    redirect(303, '/admin/login');
  }
};
