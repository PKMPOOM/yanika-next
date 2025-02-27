"use client"

import Container from "@/Components/Global/Container"
import Loader from "@/Components/Global/Loader"
import { authClient, signIn } from "@/lib/auth-client"
import { Button, Form, Input, Typography } from "antd"
// import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation"
import { useState } from "react"

const { Title, Text, Link: LinkText } = Typography

type SiteConfigurationsType = {
    email: string
    password: string
    remember_me: boolean
}

const AdminSignInPage = () => {
    const [form] = Form.useForm()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const [Error, setError] = useState<boolean>(false)
    const [Loading, setLoading] = useState<boolean>(false)

    const onSignIn = async (event: SiteConfigurationsType) => {
        try {
            setError(false)
            setLoading(true)
            // const response = await signIn("credentials", {
            //   email: event.email,
            //   password: event.password,
            //   redirect: false,
            // });

            // const { error } = await authClient.signIn.email(
            //     {
            //         /**
            //          * The user email
            //          */
            //         email: event.email,
            //         /**
            //          * The user password
            //          */
            //         password: event.password,
            //         /**
            //          * a url to redirect to after the user verifies their email (optional)
            //          */
            //         callbackURL: "/time_table",
            //         /**
            //          * remember the user session after the browser is closed.
            //          * @default true
            //          */
            //         rememberMe: false,
            //     },
            //     {
            //         //callbacks
            //     }
            // )

            const { data, error } = await authClient.signUp.email(
                {
                    email: event.email, // user email address
                    password: event.password, // user password -> min 8 characters by default
                    name: "POOM", // user display name
                    image: "", // user image url (optional)
                    callbackURL: "/", // a url to redirect to after the user verifies their email (optional)
                },
                {
                    onRequest: (ctx) => {
                        //show loading
                    },
                    onSuccess: (ctx) => {
                        //redirect to the dashboard or sign in page
                    },
                    onError: (ctx) => {
                        // display the error message
                        alert(ctx.error.message)
                    },
                }
            )

            setLoading(false)

            if (!error) {
                window.location.href = callbackUrl
            } else {
                setError(true)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    if (Loading) {
        return <Loader />
    }

    return (
        <Container>
            <div className="mx-auto w-full max-w-xl">
                <div className="mb-10">
                    <div className="hidden sm:flex">
                        <Title level={1}>Admin login</Title>
                    </div>
                </div>
                <Form
                    form={form}
                    style={{ width: "100%" }}
                    layout="horizontal"
                    onFinish={onSignIn}
                    initialValues={{
                        email: "",
                        password: "",
                        remember_me: false,
                    }}
                >
                    <div className="flex-col lg:flex">
                        <Form.Item<SiteConfigurationsType>
                            name={"email"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your email address.",
                                },
                                {
                                    type: "email",
                                    message: "Invalid email format.",
                                },
                            ]}
                        >
                            <Input placeholder="Email" size="large" />
                        </Form.Item>

                        <Form.Item<SiteConfigurationsType>
                            name={"password"}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                placeholder="Password"
                                size="large"
                            />
                        </Form.Item>

                        {Error && (
                            <div className="mb-4 flex justify-center">
                                <Text type="danger">
                                    Please check your username and password
                                </Text>
                            </div>
                        )}

                        <Button
                            loading={Loading}
                            size="large"
                            block
                            type="primary"
                            htmlType="submit"
                        >
                            Log in
                        </Button>

                        <Form.Item
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "1rem",
                            }}
                        >
                            <LinkText>Forget password</LinkText>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </Container>
    )
}

export default AdminSignInPage
