"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { makeStore } from "@/lib/store";
import { SessionProvider } from "next-auth/react";
import React, { useState } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { ThemeProvider } from "./ThemeProvider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(makeStore);

  return (
    <ReduxProvider store={store}>
      <SessionProvider>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </ReduxProvider>
  );
};

export default Provider;
