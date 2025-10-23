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
        const response = await apiClientExam.get("/account");

        return { status: response.data?.status, message: response.data?.message, 
        data: {...response.data}};
    } catch (error: any) {
        console.error("Error fetching WAEC list:", error.message);
        throw error;
    }
    }
}
// export async function