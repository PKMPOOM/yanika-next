"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import React from "react"

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [client] = React.useState(new QueryClient())

    return (
        <QueryClientProvider client={client}>
            {children} <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}
