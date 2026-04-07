import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('admin_session');
  
  if (session === 'authenticated') {
    event.locals.user = { email: 'admin' };
  } else {
    event.locals.user = null;
  }
  
  return resolve(event);
};
