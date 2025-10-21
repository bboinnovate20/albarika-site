
import axios from "axios";
import { ResponseApi, Waec } from "./type";
import {EXAM_CARDS_API_KEY, EXAM_CARDS_BASE_URL } from "@/lib/constant";
import { apiClient } from "./apiClient";


export async function buy({quantity=1}: {quantity: number}): Promise<ResponseApi> {
  try {

    const response = await apiClient.post("/exam-card/buy", {
      "card_type_id": "1",
      quantity: quantity
    });

    return { status: response.data?.status, message: response.data?.message, 
      data: {...response.data}};
  } catch (error: any) {
    console.error("Error fetching WAEC list:", error.message);
    throw error;
  }
}

// 4️⃣ Function: POST request to create a new WAEC entry
export async function createWaec(payload: Omit<Waec, "createdAt">): Promise<Waec> {
  try {
    const response = await axios.post<Waec>(
      EXAM_CARDS_BASE_URL,
      {
        ...payload,
        createdAt: new Date().toISOString(),
      },
      {
        headers: {
          "Authorization": `Bearer ${EXAM_CARDS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return object with Date type
    return { ...response.data, createdAt: new Date(response.data.createdAt) };
  } catch (error: any) {
    console.error("Error creating WAEC entry:", error.message);
    throw error;
  }
}
