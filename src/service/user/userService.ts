import { FullUserDataType } from "@/app/(pages)/manage_user/manageUser.hooks"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export const getUserData = (id: string | undefined) => {
    const fetcher = async () => {
        const response = await axios.get(`/api/user/${id}`)
        return response.data
    }

    return useQuery<FullUserDataType>({
        queryKey: ["userData", id],
        queryFn: fetcher,
        refetchOnWindowFocus: false,
        enabled: !!id,
    })
}

export const getUserPoints = (id: string | undefined) => {
    const fetcher = async () => {
        const response = await axios.get(`/api/user/${id}/points`)
        return response.data
    }

    return useQuery<{
        totalPoints: number
    }>({
        queryKey: ["userPoints", id],
        queryFn: fetcher,
        refetchOnWindowFocus: false,
        enabled: !!id,
    })
}

export type PointsHistory = {
    id: string
    amount: number
    createdAt: Date
    userId: string
    action: "add" | "subtract"
    description: string | null
}

export const getUserCreditHistory = (id: string | undefined) => {
    const fetcher = async () => {
        const response = await axios.get<PointsHistory[]>(
            `/api/user/${id}/points-history`
        )
        return response.data
    }

    return useQuery<PointsHistory[]>({
        queryKey: ["userCreditHistory", id],
        queryFn: fetcher,
        refetchOnWindowFocus: false,
        enabled: !!id,
    })
}
