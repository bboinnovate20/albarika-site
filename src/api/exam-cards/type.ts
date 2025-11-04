export interface Waec {
  serialNumber: string;
  pin: string;
  createdAt: Date;
}


export interface ResponseApi {
  status: boolean,
  message: string,
  data?: any,
}



export interface ExamCardWalletDetails {
  firstname?: string,
  lastname?: string,
  wallet_balance?: string,
}


export interface ExamCardsData{
  pin: string,
  serial_number: string,
  created_at: string,
  reference: string,
  amount: string,
  exam_card_id: number
}

export interface ScratchCard{
  pin: string,
  serialNumber: string,
  reference?: string,
  
}