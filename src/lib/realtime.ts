import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/fetcher";

// One Socket.io connection for the whole dashboard, kept outside React so
// re-renders never open a second one. Components use the hooks in
// hooks/use-realtime.ts; RealtimeProvider starts and stops it.

export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL ?? new URL(API_URL).origin;

export type RealtimeStatus = "idle" | "connecting" | "online" | "reconnecting";

export interface RealtimeSnapshot {
  status: RealtimeStatus;
  // Goes up on every successful (re)connect. Rooms are lost on reconnect, so
  // anything that joined a room re-joins and catches up when this changes.
  connectionCount: number;
}

type Handler = (payload: unknown) => void;

interface StartOptions {
  getToken: () => string | undefined;
  // Called when the server rejects the token (expired); returns a fresh one.
  refreshToken: () => Promise<string | undefined>;
}

const AUTH_RETRY_MS = 3000;

let socket: Socket | null = null;
let snapshot: RealtimeSnapshot = { status: "idle", connectionCount: 0 };
let retryTimer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();
const handlers = new Map<string, Set<Handler>>();

const setSnapshot = (patch: Partial<RealtimeSnapshot>) => {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
};

const start = ({ getToken, refreshToken }: StartOptions) => {
  if (socket) return;
  let token = getToken();

  const s = io(SOCKET_URL, {
    path: "/realtime/socket.io",
    transports: ["websocket", "polling"],
    // Read on every (re)connect, so a refreshed access token is picked up.
    auth: (cb) => cb({ token: getToken() ?? token }),
  });
  socket = s;
  setSnapshot({ status: "connecting" });

  s.on("connect", () =>
    setSnapshot({
      status: "online",
      connectionCount: snapshot.connectionCount + 1,
    }),
  );
  s.on("disconnect", () => setSnapshot({ status: "reconnecting" }));
  s.on("connect_error", () => {
    setSnapshot({ status: "reconnecting" });
    // Network errors are retried by Socket.io itself. A rejected handshake
    // (expired token) is not: refresh the session, then try again.
    if (s.active) return;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(async () => {
      token = (await refreshToken()) ?? token;
      if (socket === s) s.connect();
    }, AUTH_RETRY_MS);
  });
  s.onAny((event: string, payload: unknown) =>
    handlers.get(event)?.forEach((handler) => handler(payload)),
  );
};

const stop = () => {
  clearTimeout(retryTimer);
  socket?.disconnect();
  socket = null;
  setSnapshot({ status: "idle" });
};

export const realtime = {
  start,
  stop,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => snapshot,
  // Registered once, survives reconnects (handlers live here, not on the socket).
  on: (event: string, handler: Handler) => {
    if (!handlers.has(event)) handlers.set(event, new Set());
    handlers.get(event)!.add(handler);
    return () => {
      handlers.get(event)?.delete(handler);
    };
  },
  emit: (event: string, payload: unknown) => {
    if (socket?.connected) socket.emit(event, payload);
  },
  emitWithAck: async <T>(event: string, payload: unknown): Promise<T | null> =>
    socket?.connected
      ? ((await socket.timeout(5000).emitWithAck(event, payload)) as T)
      : null,
};
