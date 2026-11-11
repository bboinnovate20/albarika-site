import { BASE_URL, EXAM_CARDS_API_KEY, EXAM_CARDS_BASE_URL } from "@/lib/constant";
import axios from "axios";

import { toast } from "react-toastify";

export const apiClientExam = axios.create({
  baseURL: `${EXAM_CARDS_BASE_URL}/api/exam-cards`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

apiClientExam.interceptors.request.use((config) => {
  if (EXAM_CARDS_API_KEY) {
    config.headers.Authorization = `Bearer ${EXAM_CARDS_API_KEY}`;
  }
  return config;
});


export const apiAdminClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

export const apiAdminServer = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});



apiClientExam.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.errors?.[0]?.message || error?.response?.data?.message || error.message || "Unknown error";
    toast.error(message);
    return Promise.reject(error);
  }
);



// apiClientExam.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     toast.error(error.message);
//     console.error("❌ API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );
