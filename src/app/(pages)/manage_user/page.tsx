"use client";

import Container from "@/Components/Global/Container";
import Loader from "@/Components/Global/Loader";
import "@blocknote/core/style.css";
import { Avatar, Button, Input, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserDataType, useUserList } from "./manageUser.hooks";
import { useMemo, useState } from "react";
const { Text } = Typography;

const columns: ColumnsType<UserDataType> = [
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (_, { image, name }) => (
      <>
        <Avatar
          src={image}
          size={"large"}
          style={{ backgroundColor: "#fde3cf", color: "#f56a00" }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </>
    ),
    width: 100,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "Accounts provider",
    key: "accounts",
    render: (_, { Account, id }) => {
      return Account.map((item) => <div key={id}>{item.provider}</div>);
    },
    width: 200,
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (_, { email }) => (
      <div>
        {email ? <Text>{email}</Text> : <Text type="secondary">-</Text>}
      </div>
    ),
  },
  {
    title: "Action",
    render(_, record) {
      return (
        <div className="flex gap-2">
          <Link href={`/manage_user/${record.id}`}>
            <Button>Edit</Button>
          </Link>
        </div>
      );
    },
  },
];

export default function ManageUser() {
  const { data: session, status } = useSession();
  const { data, isLoading, refetch, isFetching, error } = useUserList();
  const [SearchKey, setSearchKey] = useState("");

  const filteredList = useMemo(() => {
    return data?.filter((item) => {
      return SearchKey === ""
        ? item
        : Object.entries(item).some((value) =>
            value
              .toString()
              .toLocaleLowerCase()
              .includes(SearchKey.toLocaleLowerCase()),
          );
    });
  }, [data, SearchKey]);

  if (status === "loading" || !session || isLoading) {
    return <Loader />;
  }

  const isAdmin = session.user.role === "admin";

  if (!isAdmin) {
    return redirect("/subjects");
  }

  if (error || !data) {
    return redirect("/404");
  }

  return (
    <Container>
      <div className="my-2 flex gap-2">
        <Input.Search
          placeholder="Search"
          onChange={(e) => {
            setSearchKey(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            refetch();
          }}
        >
          Refresh
        </Button>
      </div>
      <Table
        loading={isLoading || isFetching}
        dataSource={filteredList}
        columns={columns}
      />
    </Container>
  );
}
