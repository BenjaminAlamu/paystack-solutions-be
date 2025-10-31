import { UserDto } from "./user.dto";

export type MerchantDto = {
  id: string;
  businessName: string;
  bankCode: string;
  bankAccountNumber: string;
};

export type MerchantPaystackDetailsDto = {
  paystackSubaccountCode: string;
  paystackSplitCode: string;
};

export type UserMerchantDto = UserDto & MerchantDto;

export type UpdateMerchantDto = Partial<UserMerchantDto>;

export type PaystackSubaccountDto = {
  business_name: string;
  settlement_bank: string;
  account_number: string;
  percentage_charge: number;
  currency: string;
  };

  export type PaystackSubaccountResponseDto = {
    subaccount_code:  string;
  };

  export type PaystackSplitConfigDto = {
    name: string;
    type: 'percentage' | 'flat';
    currency: string;
    subaccounts: {
      subaccount: string;
      share: number;
    }[];
    bearer_type: 'subaccount' | 'account' | 'all'; 
    bearer_subaccount: string;
  };


  export type PaystackSplitConfigResponseDto = {
    split_code:  string;
  };
  
  export type PaystackInitiateTransactionDto = {
    email: string;
    amount: number;
    subaccount: string;
    metadata: {
      orderRef: string
    }
  };

  export type PaystackInitiateTransactionResponseDto = {
    authorization_url:  string;
    reference:  string;
  };

  export type PaystackCreateInvoiceDto = {
    description: string;
    amount: number;
    customer: string;
    split_code: string;
    metadata: {
      orderRef: string
    }
  };


  export type PaystackCreateInvoiceResponseDto = {
    offline_reference:  string;
    integration:  string;
  };

  
  export interface PaystackVerificationResponse {
    id: number;
    status: string;
    reference: string;
    receipt_number: string | null;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: string | Record<string, any> | null;
    log: PaystackLog | null;
    fees: number;
    fees_split: Record<string, any> | null;
    authorization: PaystackAuthorization;
    order_id: string | null;
    paidAt: string;
  }
  
  export interface PaystackLog {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: any[];
    history: Array<{
      type: string;
      message: string;
      time: number;
    }>;
  }
  
  export interface PaystackAuthorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
  }

  
  export type PaystackDVAPayload = {
    customer: string;
    split_code: string;
    metadata: {
      orderRef: string;
    };
  };

  export type PaystackDVAResponse = {
      bank: {
        name: string;
        id: number;
        slug: string;
      };
      account_name: string;
      account_number: string;
  };
  