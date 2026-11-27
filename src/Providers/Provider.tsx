"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeStore } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { SessionKeeper } from "./SessionKeeper";
import { ThemeProvider } from "./ThemeProvider";

const SESSION_REFETCH_SECONDS = 4 * 60;

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(makeStore);

  return (
    <ReduxProvider store={store}>
      {/* Access tokens live 15 minutes. Re-reading the session every 4 minutes
          lets the jwt callback refresh it before it expires (see authOptions). */}
      <SessionProvider refetchInterval={SESSION_REFETCH_SECONDS}>
        <SessionKeeper />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default Provider;
