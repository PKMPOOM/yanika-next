"use client"

import { type navMenuTypes } from "@/interface/interface"
import { authClient, useSession } from "@/lib/auth-client"
import {
    LogoutOutlined,
    MenuOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons"
import type { MenuProps } from "antd"
import {
    Avatar,
    Button,
    ConfigProvider,
    Divider,
    Drawer,
    Dropdown,
    Skeleton,
    Tag,
    theme,
} from "antd"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useState } from "react"
import Meenites from "../../../public/AppLogoNav.svg"
import Container from "./Container"
import { getUserData, getUserPoints } from "@/service/user"

const items: MenuProps["items"] = [
    {
        key: "settings",
        label: "Settings",
        icon: <SettingOutlined />,
    },

    {
        key: "sign_out",
        danger: true,
        label: "Sign out",
        icon: <LogoutOutlined />,
    },
]
const { useToken } = theme

const menuStyle: React.CSSProperties = {
    boxShadow: "none",
}

const navMenu: navMenuTypes[] = [
    {
        name: "Buy Credit",
        id: "buy_credit",
        href: "/buy_credit",
        role: ["user"],
    },
    {
        name: "Time Table",
        id: "time_table",
        href: "/time_table",
        role: ["admin"],
    },
    {
        name: "Subjects",
        id: "subjects",
        href: "/subjects",
        role: ["user", "admin"],
    },
    {
        name: "My subjects",
        id: "my_subjects",
        href: "/my_subjects",
        role: ["user"],
    },
    {
        name: "Settings",
        id: "settings",
        href: "/settings",
        role: ["user"],
    },
    {
        name: "Manage user",
        id: "manage_user",
        href: "/manage_user",
        role: ["admin"],
    },
]

function Navbar() {
    const { data: session } = useSession()
    const [DrawwerOpen, setDrawwerOpen] = useState(false)
    const currentPath = usePathname()
    const router = useRouter()

    const { data: points } = getUserPoints(session?.user.id)

    const isAdmin = session?.user.role === "admin"

    const { token } = useToken()

    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        width: "200px",
    }

    const onDropdownClick: MenuProps["onClick"] = async ({ key }) => {
        switch (key) {
            case "sign_out":
                await authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/auth/signIn")
                        },
                    },
                })

                break
            case "settings":
                isAdmin
                    ? router.push("/settings/admin")
                    : router.push("/settings")
                break
            default:
                break
        }
    }

    const onClose = () => {
        setDrawwerOpen(false)
    }

    const drawerNavigate = (href: string) => {
        router.push(href)
        setDrawwerOpen(false)
    }

    return (
        <>
            <div className="fixed top-0 z-30 w-full border-b bg-white ">
                <div className=" w-full max-w-7xl mx-auto  ">
                    <div className="flex h-10 items-center justify-between overflow-hidden">
                        <Link href={isAdmin ? "/time_table" : "/subjects"}>
                            <div className="w-24">
                                <Meenites />
                            </div>
                        </Link>

                        <ConfigProvider
                            theme={{
                                token: {
                                    colorPrimary: "#fff",
                                    colorPrimaryHover: "#ecfdf5",
                                    colorBgTextHover: "#ecfdf5",
                                },
                            }}
                        >
                            <div className="hidden md:flex">
                                {session?.user ? (
                                    <>
                                        <ul className="flex items-center gap-3">
                                            {session.user.role === "admin" && (
                                                <li>
                                                    <Tag>Admin</Tag>
                                                </li>
                                            )}
                                            <li>
                                                <Tag
                                                    color={getTagColor(
                                                        points?.totalPoints ?? 0
                                                    )}
                                                >
                                                    <p>
                                                        Credit:
                                                        <span className="font-semibold">
                                                            {` ${points ? points?.totalPoints : "Loading..."}`}
                                                        </span>
                                                    </p>
                                                </Tag>
                                            </li>
                                            {navMenu
                                                .filter((item) =>
                                                    item.role.includes(
                                                        session?.user.role
                                                    )
                                                )
                                                .map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        href={item.href}
                                                    >
                                                        <li>
                                                            <Button
                                                                size="small"
                                                                type={
                                                                    currentPath.includes(
                                                                        item.href
                                                                    )
                                                                        ? "primary"
                                                                        : "text"
                                                                }
                                                            >
                                                                <p
                                                                    className={`mb1 ${
                                                                        currentPath.includes(
                                                                            item.href
                                                                        )
                                                                            ? "font-semibold text-emerald-500"
                                                                            : ""
                                                                    } `}
                                                                >
                                                                    {item.name}
                                                                </p>
                                                            </Button>
                                                        </li>
                                                    </Link>
                                                ))}
                                            <li>
                                                <Dropdown
                                                    placement="bottomRight"
                                                    menu={{
                                                        items,
                                                        onClick:
                                                            onDropdownClick,
                                                    }}
                                                    dropdownRender={(menu) => (
                                                        <div
                                                            style={contentStyle}
                                                        >
                                                            <div
                                                                style={{
                                                                    padding:
                                                                        "10px 16px",
                                                                }}
                                                            >
                                                                <p>
                                                                    @
                                                                    {
                                                                        session
                                                                            ?.user
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-500">
                                                                    {session
                                                                        ?.user
                                                                        ?.email ??
                                                                        "No email added"}
                                                                </p>
                                                            </div>
                                                            <Divider
                                                                style={{
                                                                    margin: 0,
                                                                }}
                                                            />

                                                            {React.cloneElement(
                                                                menu as React.ReactElement,
                                                                {
                                                                    style: menuStyle,
                                                                }
                                                            )}
                                                        </div>
                                                    )}
                                                >
                                                    <Avatar
                                                        style={{
                                                            backgroundColor:
                                                                "#10b981",
                                                            cursor: "pointer",
                                                        }}
                                                        src={
                                                            session?.user.image
                                                        }
                                                        icon={<UserOutlined />}
                                                    />
                                                </Dropdown>
                                            </li>
                                        </ul>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-5">
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Avatar
                                            active={true}
                                            size={"default"}
                                        />
                                    </div>
                                )}
                            </div>

                            <Drawer
                                title="Menu"
                                placement="right"
                                onClose={onClose}
                                open={DrawwerOpen}
                            >
                                {session?.user ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    style={{
                                                        backgroundColor:
                                                            "#10b981",
                                                        cursor: "pointer",
                                                    }}
                                                    src={session?.user.image}
                                                    icon={<UserOutlined />}
                                                />

                                                <div className="px-2">
                                                    <p>
                                                        @{session?.user?.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {session?.user?.email ??
                                                            "No email added"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Divider />

                                        <div className="flex flex-col items-start">
                                            {navMenu
                                                .filter((item) =>
                                                    item.role.includes(
                                                        session?.user.role
                                                    )
                                                )
                                                .map((item) => (
                                                    <div
                                                        key={item.id}
                                                        onClick={() => {
                                                            drawerNavigate(
                                                                item.href
                                                            )
                                                        }}
                                                        className="flex h-14 w-full cursor-pointer items-center border-b"
                                                    >
                                                        <div className="justify-start text-lg font-semibold">
                                                            <p>{item.name}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        <div className="mt-7 flex flex-col gap-2">
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    // signOut()
                                                }}
                                                size="large"
                                                icon={<LogoutOutlined />}
                                                danger
                                            >
                                                Sign out
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-5">
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Button
                                            active={true}
                                            size={"small"}
                                        />
                                        <Skeleton.Avatar
                                            active={true}
                                            size={"default"}
                                        />
                                    </div>
                                )}
                            </Drawer>
                        </ConfigProvider>
                        <div className="md:hidden">
                            <Button
                                onClick={() => {
                                    setDrawwerOpen(true)
                                }}
                                icon={<MenuOutlined />}
                                type="primary"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {session && !session?.user.email && currentPath !== "/settings" && (
                <div className="fixed top-10 z-50 flex w-screen justify-center bg-red-400">
                    <div className="flex h-10 w-full max-w-7xl items-center justify-between px-8 xl:px-0">
                        <p className="text-white">
                            No email added{" "}
                            <span>
                                <Link href={"/settings"}>Add email</Link>
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar

const getTagColor = (points: number) => {
    if (points < 2) {
        return "red"
    }
    if (points < 4) {
        return "orange"
    }
    return "green"
}
