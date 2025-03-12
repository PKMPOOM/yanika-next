"use client"

import { authClient } from "@/lib/auth-client"
import { Button, Typography } from "antd"
import { signIn } from "next-auth/react"
import { FcGoogle } from "react-icons/fc"

const { Title, Text } = Typography

function SignInForm() {
    const googleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: `${window.location.origin}/subjects`,
            // options: {
            //     callbackUrl: `${window.location.origin}/subjects`,
            // }
        })
    }
    return (
        <div className="mx-auto flex w-full max-w-xl flex-col justify-start bg-white px-10 xl:pt-20">
            <div className="mb-10">
                <div className="hidden sm:flex">
                    <Title level={1}>Happy to See You!</Title>
                </div>
                <Text>Please sign In to Continue</Text>
            </div>

            <div className="flex justify-start gap-2">
                <Button
                    size="large"
                    onClick={googleSignIn}
                    // onClick={() => {
                    //     signIn("google", {
                    //         callbackUrl: `${window.location.origin}/subjects`,
                    //     })
                    // }}
                >
                    <div className="mx-auto flex items-center justify-center gap-2">
                        <FcGoogle style={{ fontSize: 20 }} /> continue with
                        Google
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default SignInForm
