export interface Waec {
  serialNumber: string;
  pin: string;
  createdAt: Date;
}


export interface ResponseApi {
  status: boolean,
  message: string,
  data?: string,
}



export interface ExamCardWalletDetails {
  firstname: string,
  lastname: string,
  wallet_balance: string,
}
