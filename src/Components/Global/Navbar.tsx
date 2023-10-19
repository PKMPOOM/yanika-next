"use client";

import React from "react";
import Link from "next/link";
import {
  Avatar,
  Dropdown,
  Divider,
  theme,
  Skeleton,
  Tag,
  Typography,
  Button,
  ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { type navMenuTypes } from "@/interface/interface";

const { Title } = Typography;

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
];
const { useToken } = theme;

const menuStyle: React.CSSProperties = {
  boxShadow: "none",
};

const navMenu: navMenuTypes[] = [
  {
    name: "Dashboard",
    id: "dashboard",
    href: "/dashboard",
    role: ["admin"],
  },
  {
    name: "Request class",
    id: "request_class",
    href: "/request",
    role: ["admin"],
  },
  {
    name: "Classes",
    id: "classes",
    href: "/classes",
    role: ["user", "admin"],
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
    name: "settings",
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
];

function Navbar() {
  const { data: session } = useSession();
  const currentPath = usePathname();
  const router = useRouter();

  const isAdmin = session?.user.role === "admin";

  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    width: "200px",
  };

  const onDropdownClick: MenuProps["onClick"] = ({ key }) => {
    console.log(key);

    switch (key) {
      case "sign_out":
        return signOut();
      case "settings":
        isAdmin ? router.push("/settings/admin") : router.push("/settings");
        break;
      default:
        break;
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#fff",
          colorPrimaryHover: "#ecfdf5",
          colorBgTextHover: "#ecfdf5",
        },
      }}
    >
      <nav className=" flex h-10  w-full items-center justify-center border-b border-slate-200  ">
        <div className=" flex w-full max-w-7xl items-center justify-between px-8 xl:px-0">
          <Link href={isAdmin ? "/dashboard" : "/classes"}>
            <Title style={{ marginBottom: 0 }} level={5}>
              Meenites
            </Title>
          </Link>

          {session?.user ? (
            <>
              <ul className=" flex items-center gap-3 ">
                {session.user.role === "admin" && (
                  <li>
                    <Tag>Admin</Tag>
                  </li>
                )}
                {navMenu
                  .filter((item) => item.role.includes(session?.user.role))
                  .map((item) => (
                    <Link key={item.id} href={item.href}>
                      <li>
                        <Button
                          // shape="round"
                          size="small"
                          type={
                            currentPath.includes(item.href)
                              ? // item.href === currentPath
                                "primary"
                              : "text"
                          }
                        >
                          <p
                            className={` mb1 ${
                              currentPath.includes(item.href)
                                ? // item.href === currentPath
                                  "font-semibold text-emerald-500"
                                : ""
                            } `}
                          >
                            {" "}
                            {item.name}
                          </p>
                        </Button>
                      </li>
                    </Link>
                  ))}
                <li>
                  <Dropdown
                    placement="bottomRight"
                    menu={{ items, onClick: onDropdownClick }}
                    dropdownRender={(menu) => (
                      <div style={contentStyle}>
                        <div style={{ padding: "10px 16px" }}>
                          <p>@{session?.user?.name}</p>
                          <p className=" text-xs text-slate-500">
                            {session?.user?.email ?? "No email added"}
                          </p>
                        </div>
                        <Divider style={{ margin: 0 }} />

                        {React.cloneElement(menu as React.ReactElement, {
                          style: menuStyle,
                        })}
                      </div>
                    )}
                  >
                    <Avatar
                      style={{
                        backgroundColor: "#10b981",
                        cursor: "pointer",
                      }}
                      src={session?.user.image}
                      icon={<UserOutlined />}
                    />
                  </Dropdown>
                </li>
              </ul>
            </>
          ) : (
            <div className=" flex items-center gap-5">
              <Skeleton.Button active={true} size={"small"} />
              <Skeleton.Button active={true} size={"small"} />
              <Skeleton.Button active={true} size={"small"} />
              <Skeleton.Button active={true} size={"small"} />
              <Skeleton.Avatar active={true} size={"default"} />
            </div>
          )}
        </div>
      </nav>
    </ConfigProvider>
  );
}

export default Navbar;
