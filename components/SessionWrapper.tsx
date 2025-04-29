"use client";
import { SessionProvider } from "next-auth/react";

import React from "react";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider
      refetchInterval={0} // Disable automatic session refetching
      refetchOnWindowFocus={false} // Disable session refetching when a tab gets focus
    >
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;
