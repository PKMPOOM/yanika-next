"use client";

import React from "react";
import Link from "next/link";
import { z } from "zod";
import {
  Avatar,
  Dropdown,
  Divider,
  theme,
  ConfigProvider,
  Skeleton,
  Tag,
} from "antd";
import type { MenuProps } from "antd";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import themeConfig from "@/theme/themeConfig";
import { type systemRoles, navMenuTypes } from "@/interface/interface";

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

const currentRole = "admin";

const navMenu: navMenuTypes[] = [
  {
    name: "Dashboard",
    id: "dashboard",
    href: "/dashboard",
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

  const { token } = useToken();

  const contentStyle: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
    width: "200px",
  };

  const onDropdownClick: MenuProps["onClick"] = ({ key }) => {
    console.log(key);
    if (key === "sign_out") {
      signOut();
    }
  };

  console.log(session);

  return (
    <ConfigProvider theme={themeConfig}>
      <nav className=" w-full h-10  justify-center flex items-center border-b border-slate-200  ">
        <div className=" w-full max-w-7xl flex justify-between items-center px-8 xl:px-0">
          <Link
            href={session?.user.role === "admin" ? "/dashboard" : "/classes"}
          >
            {/* <div>Yanika</div> */}
            <div>Meenites</div>
          </Link>

          {session?.user ? (
            <>
              <ul className=" flex gap-3 items-center ">
                {session.user.role === "admin" && (
                  <li>
                    <Tag>Admin</Tag>
                  </li>
                )}
                {navMenu
                  .filter((item) => item.role.includes(session?.user.role))
                  .map((item) => (
                    <Link key={item.id} href={item.href}>
                      <li
                        className={`${
                          currentPath.includes(item.href)
                            ? // item.href === currentPath
                              "font-semibold text-emerald-500"
                            : ""
                        }  py-1 text-sm  px-4 rounded hover:bg-emerald-50 cursor-pointer hover:text-emerald-500 transition-all duration-200`}
                      >
                        {item.name}
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
            <div className=" flex gap-5 items-center">
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
