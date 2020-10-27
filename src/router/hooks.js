import { login } from "@/common/session";
import { APP } from "@/router/global";
import store from "@/store";

export const canAccessRoute = route => {
  console.debug("[Router] Check if the user can access to route", { route });

  // se non si tratta di una route accessibile a tutti
  // => controlliamo prima che l'utente sia loggato
  const isPublicRoute = route.meta && route.meta.isPublic;
  const ifOperatorAuthenticated = store.getters.ifOperatorAuthenticated;

  // Al primo accesso Vue router potrebbe non aver ancora risolto l'url della HOME
  const isVueRouterResolvingUrl = route.fullPath === "/";

  console.debug("[Router] Info:", {
    isPublicRoute,
    ifOperatorAuthenticated,
    isVueRouterResolvingUrl
  });
  return isPublicRoute || ifOperatorAuthenticated || isVueRouterResolvingUrl;
};

// questo hook controlla se la route di destinazione richiede il login
// se richiede il login e l'utente non è loggato => redirige al login
// altrimenti fa proseguire il flusso di navigazione normalmente
//
// @NOTE: questo metodo NON può essere chiamato prima della fine del caricamento iniziale
export const ensureLogin = (to, from, next) => {
  console.debug("[Router] Ensure login", { from, to });
  const canAccess = canAccessRoute(to);

  // Se l'utente non può accedere alla route => effettuiamo il redirect al login
  if (!canAccess) {
    if (!store.getters.ifOperatorAuthenticated) {
      console.debug(
        "[Router] The route is not public and the user is not logged => redirect to login..."
      );
      login();
      return;
    }

    console.debug(
      "[Router] The route is not public and the user is logged => redirect to home..."
    );
    next(APP);
    return;
  }

  // altrimenti andiamo semplicemente avanti
  console.debug("[Router] User can access to route");
  next();
};
