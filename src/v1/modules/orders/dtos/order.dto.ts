import { OrderPaymentMethod } from "../enums/order.enum";

export type OrderItemDto = {
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
    subtotal: number;
  };

  export type OrderDto = {
    id?: string;
    merchantId: string;
    userId: string;
    totalAmount: number;
    totalQuantity: number;
    status?: string;
    orderRef?: number;
    paymentMode: OrderPaymentMethod
  };

  export type SingleOrderItemDto = {
    productId: string;
    quantity: number;
  };

  export type SingleOrderDto = {
    items: SingleOrderItemDto[];
    paymentMode: OrderPaymentMethod
    userId: string
  };

  export interface PaystackChargeSuccessEvent {
    event: "charge.success";
    data: PaystackTransactionData;
  }
  
  export interface PaystackTransactionData {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: {
      referrer?: string;
      [key: string]: any;
    };
    fees: number;
    fees_split: {
      paystack: number;
      integration: number;
      subaccount: number;
      params: {
        bearer: string;
        transaction_charge: string | number;
        percentage_charge: string | number;
      };
    };

  }
  

  