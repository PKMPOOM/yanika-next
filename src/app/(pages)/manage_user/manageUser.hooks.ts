import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type UserDataType = {
  id: string;
  name: string;
  email: null;
  image: string;
  role: string;
  Account: {
    provider: string;
  }[];
};

export const useUserList = () => {
  const fetcher = async () => {
    const response = await axios.get("/api/user/list");
    return response.data;
  };

  return useQuery<UserDataType[]>({
    queryKey: ["userList"],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
  });
};

export const useUserData = (id: string) => {
  const fetcher = async () => {
    const response = await axios.get(`/api/user/${id}`);
    return response.data;
  };

  return useQuery<FullUserDataType>({
    queryKey: ["userData", id],
    queryFn: fetcher,
    refetchOnWindowFocus: false,
  });
};

export type FullUserDataType = {
  id: string;
  name: string;
  email: string;
  emailVerified: null;
  image: string;
  password: string;
  role: string;
  accounts: Account[];
  time_slot: {
    id: string;
    index: number;
    start_time: string;
    parsed_start_time: string;
    duration: number;
    dayId: string;
    subjectId: string;
    userBooked: string[];
    accept: boolean;
    bookingType: string;
    totalPrice: number;
    isScheduled: boolean;
    scheduleDateTime: null;
    meetingLink: null;
    eventID: null;
    userId: string;
    subject: Subject;
  }[];
};

export interface Account {
  provider: string;
  type: string;
  scope: string;
  providerAccountId: string;
}

export interface Subject {
  id: string;
  name: string;
  grade: string;
  group_price: number;
  single_price: number;
  image_url: string;
  update_at: string;
}
