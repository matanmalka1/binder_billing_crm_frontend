export const buildSigningUrl = (hint: string): string => {
  const path = hint.startsWith("/") ? hint : `/${hint}`;
  return `${window.location.origin}${path}`;
};