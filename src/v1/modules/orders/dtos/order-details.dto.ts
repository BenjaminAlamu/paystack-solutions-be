import { OrderPaymentMethod } from "../enums/order.enum";

export type CreatePaymentDetailsDto = {
    orderId: string;
    channel: OrderPaymentMethod;
    amount: number;
    reference: string;
    authorization_url?: string;
    offline_reference?: string;
    split_code?: string;
  };

  export type AttachVirtualAccountDto = {
    account_number: string;
    bank_name: string;
  };

  export type ConfirmPaymentDetailsDto = {
    status: string;
    id: string;
    transactionResponse: Record<string, any>;
  };


  