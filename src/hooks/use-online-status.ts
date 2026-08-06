"use client";

import { useEffect, useState } from "react";

/**
 * hooks/use-online-status.ts
 *
 * Tracks navigator.onLine plus the browser's online/offline events.
 * navigator.onLine only reflects network *interface* state (e.g. wifi
 * connected), not real reachability, so on reconnect we also fire a
 * small no-cors HEAD request before flipping back to "online" — avoids
 * flashing "back online" when wifi reconnects to a router with no
 * actual internet.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout>;

    async function verifyReachable() {
      try {
        await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
        setIsOnline(true);
        setJustReconnected(true);
        reconnectTimer = setTimeout(() => setJustReconnected(false), 2500);
      } catch {
        setIsOnline(false);
      }
    }

    function handleOnline() {
      verifyReachable();
    }
    function handleOffline() {
      clearTimeout(reconnectTimer);
      setIsOnline(false);
      setJustReconnected(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(reconnectTimer);
    };
  }, []);
  console.log({ isOnline, justReconnected });
  return { isOnline, justReconnected };
}
