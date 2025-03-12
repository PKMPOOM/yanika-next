import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins"
import { auth } from "./auth"

export const authClient = createAuthClient({
    baseURL: process.env.BASE_URL!, // Optional if the API base URL matches the frontend
    plugins: [customSessionClient<typeof auth>()],
})

export const { signIn, signOut, useSession } = authClient
