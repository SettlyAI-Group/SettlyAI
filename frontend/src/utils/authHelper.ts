// check if token is expired
export const isTokenExpired = (exp: number | null) => {
  if (!exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return exp < now;
};