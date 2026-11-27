"use client";

import { useEffect, useEffectEvent, useSyncExternalStore } from "react";
import { realtime, type RealtimeSnapshot } from "@/lib/realtime";

const SERVER_SNAPSHOT: RealtimeSnapshot = { status: "idle", connectionCount: 0 };

export function useRealtimeStatus(): RealtimeSnapshot {
  return useSyncExternalStore(realtime.subscribe, realtime.getSnapshot, () => SERVER_SNAPSHOT);
}

// Runs `handler` for every `event` while the component is mounted. The
// handler always sees the latest props/state without re-subscribing.
export function useRealtimeEvent<T>(event: string, handler: (payload: T) => void) {
  const onEvent = useEffectEvent((payload: unknown) => handler(payload as T));
  useEffect(() => realtime.on(event, onEvent), [event]);
}
