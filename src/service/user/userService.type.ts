export type Subject = {
    id: string
    name: string
    grade: string
    group_price: number
    single_price: number
    image_url: string
    update_at: string
}

export type FullUserDataType = {
    id: string
    name: string
    email: string
    image: string
    role: string
    totalPoints: number
    Account: Account[]
    TimeSlot: {
        id: string
        index: number
        start_time: string
        parsed_start_time: string
        duration: number
        dayId: string
        subjectId: string
        userBooked: string[]
        accept: boolean
        bookingType: string
        totalPrice: number
        isScheduled: boolean
        scheduleDateTime: null
        meetingLink: null
        eventID: null
        userId: string
        subject: Subject
    }[]
}

export type Account = {
    providerId: string
    accessToken: string
    refreshToken: null
    accessTokenExpiresAt: Date
    refreshTokenExpiresAt: null
    scope: string
    idToken: string
    createdAt: Date
    updatedAt: Date
}
