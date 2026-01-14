// frontend/src/api/token.ts
let tokenGetter: null | (() => Promise<string | null>) = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

export async function getAuthToken() {
  if (!tokenGetter) return null;
  return tokenGetter();
}
