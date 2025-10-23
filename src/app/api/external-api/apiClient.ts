import { EXAM_CARDS_API_KEY, EXAM_CARDS_BASE_URL } from "@/lib/constant";
import axios from "axios";
import { toast } from "react-toastify";


// ✅ Create an Axios instance
export const apiClientExam = axios.create({
  baseURL: `${EXAM_CARDS_BASE_URL}/api/exam-cards`,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClientExam.interceptors.request.use(
  (config) => {

    if (EXAM_CARDS_API_KEY) {
      config.headers["Authorization"] = `Bearer ${EXAM_CARDS_API_KEY}`;
    }

    if (config.data && typeof config.data === "object") {
      config.data = {
        ...config.data,
        requestedAt: new Date().toISOString(),
      };
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

apiClientExam.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.message);
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
