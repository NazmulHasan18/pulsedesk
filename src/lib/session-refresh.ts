// Lets non-React code (RTK Query, the socket) ask next-auth for a fresh
// session. SessionKeeper registers useSession().update here.
//
// Why update() and not getSession(): getSession() refreshes the cookie but
// does NOT update useSession() in this tab, so components would keep sending
// the expired token. update() refetches and sets the session state, every
// component re-renders with the new token, and RTK Query refetches.

type Refresher = () => Promise<string | undefined>;

let refresher: Refresher | null = null;
let inFlight: Promise<string | undefined> | null = null;

export const registerSessionRefresher = (fn: Refresher | null) => {
  refresher = fn;
};

// Many requests can fail with 401 at once; they all share one refresh.
export const refreshSession = (): Promise<string | undefined> => {
  if (!refresher) return Promise.resolve(undefined);
  inFlight ??= refresher().finally(() => {
    inFlight = null;
  });
  return inFlight;
};
