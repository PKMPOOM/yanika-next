"use client"

import { useSession } from "@/lib/auth-client"
import {
    getUserCreditHistory,
    getUserPoints,
    PointsHistory,
} from "@/service/user"
import { Badge, Button, Table, Tag } from "antd"
import dayjs from "dayjs"
import Link from "next/link"
import React from "react"
import { ColumnsType } from "antd/es/table"

type Props = {}

const dataSource = [
    {
        key: "1",
        name: "Mike",
        age: 32,
        address: "10 Downing Street",
    },
    {
        key: "2",
        name: "John",
        age: 42,
        address: "10 Downing Street",
    },
]

const columns: ColumnsType<PointsHistory> = [
    {
        title: "amount",
        dataIndex: "amount",
        key: "amount",
        render(_, record) {
            return <div>{`${record.amount} credit`}</div>
        },
    },
    {
        title: "id",
        dataIndex: "id",
        key: "id",
    },
    {
        title: "Date & Time",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_, record) => {
            return (
                <div>{dayjs(record.createdAt).format("DD MMM YYYY HH:mm")}</div>
            )
        },
    },
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
        render(_, record) {
            return (
                <Tag color={record.action === "add" ? "success" : "error"}>
                    {record.action}
                </Tag>
            )
        },
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
]

const CreditHistory = (props: Props) => {
    const { data: session } = useSession()
    const { data: creditHistory, isLoading } = getUserCreditHistory(
        session?.user.id
    )
    const { data: userPoints } = getUserPoints(session?.user.id)
    return (
        <div className=" flex flex-col w-full gap-4">
            <div className=" flex gap-4">
                <div className=" border border-slate-300 rounded-md p-4 flex flex-col gap-2 h-[150px] flex-1">
                    <p className=" text-xl font-semibold">Total Balance</p>
                    <p className=" text-sm text-slate-500">
                        Current account balance
                    </p>
                    <p className=" text-2xl font-bold text-emerald-500">
                        {userPoints?.totalPoints}
                    </p>
                </div>
                <div className=" border border-slate-300 rounded-md p-4 flex flex-col gap-2 h-[150px] min-w-[250px]">
                    <p className=" text-xl font-semibold">Total Transactions</p>
                    <p className=" text-sm text-slate-500">
                        Total number of transactions
                    </p>
                    <p className=" text-2xl font-bold ">
                        {creditHistory?.length}
                    </p>
                </div>
                <div className=" border border-slate-300 rounded-md p-4 flex flex-col gap-2 min-h-[150px] min-w-[250px]">
                    <p className=" text-xl font-semibold">Buy Credits</p>
                    <p className=" text-sm text-slate-500">
                        Buy credits to book classes
                    </p>
                    <Link href="/buy_credit">
                        <Button type="primary" className="w-full">
                            Buy Credits
                        </Button>
                    </Link>
                </div>
            </div>
            <div className=" border border-slate-300 rounded-md p-4 flex flex-col gap-2 ">
                <p className=" text-xl font-semibold">Transaction History</p>
                <p className=" text-sm text-slate-500 mb-4">
                    View all your past transactions
                </p>
                <Table
                    dataSource={creditHistory}
                    columns={columns}
                    loading={isLoading}
                />
            </div>
        </div>
    )
}

export default CreditHistory
