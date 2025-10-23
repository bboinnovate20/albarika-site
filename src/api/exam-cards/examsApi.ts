import axios from "axios";
import { ResponseApi, Waec } from "./type";
import { EXAM_CARDS_API_KEY, EXAM_CARDS_BASE_URL } from "@/lib/constant";
import {  apiClientExam } from "./apiClient";


// export async function getAllCards(): Promise<Waec[]> {
//   try {
//     const response = await apiClient
//   } catch (error: any) {
//     console.error("Error fetching WAEC list:", error.message);
//     throw error;
//   }
// }
export const examApi = {
    
    accountDetails: async () : Promise<ResponseApi> => {
        try {
            const response = await apiClientExam.get("/accounts");

            return { status: response.data?.status, message: response.data?.message, 
            ...response.data};
        } catch (error: any) {
            console.error("Error fetching account detail:", error.message);
            throw error;
        }
    },
    purchasedExamList: async () : Promise<ResponseApi> => {
        try {
            const response = await apiClientExam.get("/purchase");

            return { status: response.data?.status, message: response.data?.message, 
            ...response.data};
        } catch (error: any) {
            console.error("Error fetching WAEC list:", error.message);
            throw error;
        }
    },

     purchasedWAECExamList: async () : Promise<ResponseApi> => {
        try {
            const response = await apiClientExam.get("/purchase",{
                params: {
                    exam_id: 1
                }
            });

            return { status: response.data?.status, message: response.data?.message, 
            ...response.data};
        } catch (error: any) {
            console.error("Error fetching WAEC list:", error.message);
            throw error;
        }
    },
     purchasedWAECCard: async () : Promise<ResponseApi> => {
        try {
            const response = await apiClientExam.post("/purchase",{
               card_type_id: 1,
               quantity: 1
            });

            return { status: response.data?.status, message: response.data?.message, 
            ...response.data};
        } catch (error: any) {
            console.error("Error fetching WAEC list:", error.message);
            throw error;
        }
    }
}


// export async function