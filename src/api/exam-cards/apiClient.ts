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

apiClientExam.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") { // Ensure this runs only on the client-side
      const token = localStorage.getItem("accessToken"); // Assuming token is stored as 'accessToken'
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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



function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

apiClientExam.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      // Try to get token from cookie first
      const token = getCookie("auth_token");
      
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


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
