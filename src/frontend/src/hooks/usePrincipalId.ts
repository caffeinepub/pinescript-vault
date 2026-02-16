import { useInternetIdentity } from './useInternetIdentity';

export function usePrincipalId() {
  const { identity } = useInternetIdentity();

  const principalId = identity ? identity.getPrincipal().toString() : null;
  const isAuthenticated = !!identity;

  return {
    principalId,
    isAuthenticated,
  };
}
