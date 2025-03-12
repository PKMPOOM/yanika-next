"use client"

import { useQueryClient } from "@tanstack/react-query"
import { Button } from "antd"
import { useState } from "react"
import { acceptClass } from "./api"

type ClassActionButtonProps = {
    classId: string
    dayId: any
}

const ClassActionButton = ({ classId, dayId }: ClassActionButtonProps) => {
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient()

    const acceptThisClass = async (id: string) => {
        setLoading(true)
        await acceptClass(id)
        setLoading(false)
        queryClient.invalidateQueries({
            queryKey: ["todayClass", dayId],
        })
    }

    return (
        <Button
            loading={loading}
            type="primary"
            onClick={() => {
                acceptThisClass(classId)
            }}
            block
        >
            <span className="px-5">Accept this class</span>
        </Button>
    )
}

export default ClassActionButton
