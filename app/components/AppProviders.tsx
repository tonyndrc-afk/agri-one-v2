"use client";
import { AppStoreProvider } from "./store";
import { CopilotPanel, CopilotFab } from "./Copilot";
import { SplashGate } from "./Splash";
import { Toaster } from "./Toaster";
import { PersonaTransition } from "./PersonaTransition";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      <SplashGate />
      {children}
      <CopilotPanel />
      <CopilotFab />
      <PersonaTransition />
      <Toaster />
    </AppStoreProvider>
  );
}
