import axios from "axios";

export const removeGoogleIntegration = () => {
  try {
    return axios.delete("/api/admin/integrations");
  } catch (error) {
    console.log(error);
  }
};

export const checkGoogleConnection = () => {
  try {
    return axios.post("/api/admin/integrations");
  } catch (error) {
    console.log(error);
  }
};

export const connectGoogleCalendar = (code: string) => {
  try {
    return axios.post("/api/google/calendar", {
      code,
    });
  } catch (error) {
    console.log(error);
  }
};

export const reconnectGoogleCalendar = () => {
  try {
    return axios.put("/api/google/calendar");
  } catch (error) {
    console.log(error);
  }
};
