import Cookies from 'js-cookie';

export const getAuthCookie = () => {
  const retrToken = Cookies.get('authToken');
  return retrToken;
}