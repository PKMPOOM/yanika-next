"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = React.useState(new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        {children} <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
