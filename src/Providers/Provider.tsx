"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "./ThemeProvider";

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <TooltipProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </TooltipProvider>
    </SessionProvider>
  );
};

export default Provider;
