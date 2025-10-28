import { BASE_URL, EXAM_CARDS_API_KEY, EXAM_CARDS_BASE_URL } from "@/lib/constant";
import axios from "axios";

import { toast } from "react-toastify";


export const apiClientExam = axios.create({
  baseURL: `${EXAM_CARDS_BASE_URL}/api/exam-cards`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
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



// apiClientExam.interceptors.request.use(
//   (config) => {

//     if (EXAM_CARDS_API_KEY) {
//       config.headers["Authorization"] = `Bearer ${EXAM_CARDS_API_KEY}`;
//     }

//     if (config.data && typeof config.data === "object") {
//       config.data = {
//         ...config.data,
//         requestedAt: new Date().toISOString(),
//       };
//     }

//     return config;
//   },
//   (error) => {
//     console.error("❌ Request error:", error);
//     return Promise.reject(error);
//   }
// );
apiClientExam.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Handle Unauthorized
    if (status === 401) {
      console.warn("Unauthorized — redirecting to admin login...");

      // Option 1: Redirect to login page (for pages)
       if (typeof window !== "undefined") {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/auth/admin/login";
      }
      // Option 2 (App Router): use redirect('/admin/login') in server components
      // or import { useRouter } from 'next/navigation' for client components

      // toast.error("Session expired. Please log in again.");
    }

    // Handle other errors
    const message =
      error?.response?.data?.errors?.[0]?.message || error.message || "Unknown error";
    toast.error(message);
    console.error("❌ API Error:", error.response?.data || error.message);

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
