import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies, url }) => {
  const session = cookies.get('admin_session');
  
  if (url.pathname !== '/admin/login' && session !== 'authenticated') {
    redirect(303, '/admin/login');
  }
  
  if (url.pathname === '/admin/login' && session === 'authenticated') {
    redirect(303, '/admin');
  }
  
  return { authenticated: session === 'authenticated' };
};
