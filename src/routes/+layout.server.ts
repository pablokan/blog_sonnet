import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const session = cookies.get('admin_session');
  return {
    authenticated: session === 'authenticated'
  };
};
