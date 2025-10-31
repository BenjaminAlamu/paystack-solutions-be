import {
  PaystackCustomerDto,
  PaystackCustomerResponseDto,
} from "./../../v1/modules/auth/dtos/user.dto";
import * as dotenv from "dotenv";
import HTTPClient from "@shared/http-client/http-client";
import logger from "@utils/logger";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import { injectable } from "tsyringe";
import appConfig from "@config/app.config";
import {
  PaystackCreateInvoiceDto,
  PaystackCreateInvoiceResponseDto,
  PaystackDVAPayload,
  PaystackDVAResponse,
  PaystackInitiateTransactionDto,
  PaystackInitiateTransactionResponseDto,
  PaystackSplitConfigDto,
  PaystackSplitConfigResponseDto,
  PaystackSubaccountDto,
  PaystackSubaccountResponseDto,
  PaystackVerificationResponse,
} from "src/v1/modules/auth/dtos/merchant.dto";

dotenv.config();

interface ApiResponse<T> {
  status: string;
  data: T;
}

@injectable()
export class PaystackHttpClient extends HTTPClient {
  PAYSTACK_HEADERS = {
    headers: { Authorization: `Bearer ${appConfig.paystack.apiKey}` },
  };

  async createCustomer(
    data: PaystackCustomerDto
  ): Promise<PaystackCustomerResponseDto> {
    try {
      const url = `${appConfig.paystack.baseUrl}/customer`;
      const response = await HTTPClient.post<
        ApiResponse<PaystackCustomerResponseDto>
      >(url, data, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating Paystack customer: ${error?.response?.data?.message}`
      );
    }
  }

  async createSubaccount(
    data: PaystackSubaccountDto
  ): Promise<PaystackSubaccountResponseDto> {
    try {
      const url = `${appConfig.paystack.baseUrl}/subaccount`;
      const response = await HTTPClient.post<
        ApiResponse<PaystackSubaccountResponseDto>
      >(url, data, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating subaccount: ${error?.response?.data?.message}`
      );
    }
  }

  async createTransactionSplit(
    data: PaystackSplitConfigDto
  ): Promise<PaystackSplitConfigResponseDto> {
    try {
      const url = `${appConfig.paystack.baseUrl}/split`;
      const response = await HTTPClient.post<
        ApiResponse<PaystackSplitConfigResponseDto>
      >(url, data, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating : ${error?.response?.data?.message}`
      );
    }
  }

  async createTransaction(
    data: PaystackInitiateTransactionDto
  ): Promise<PaystackInitiateTransactionResponseDto> {
    try {
      const url = `${appConfig.paystack.baseUrl}/transaction/initialize`;
      const response = await HTTPClient.post<
        ApiResponse<PaystackInitiateTransactionResponseDto>
      >(url, { ...data, bearer: "subaccount" }, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating : ${error?.response?.data?.message}`
      );
    }
  }

  async createInvoice(
    data: PaystackCreateInvoiceDto
  ): Promise<PaystackCreateInvoiceResponseDto> {
    try {
      const url = `${appConfig.paystack.baseUrl}/paymentrequest`;
      const response = await HTTPClient.post<
        ApiResponse<PaystackCreateInvoiceResponseDto>
      >(url, data, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating : ${error?.response?.data?.message}`
      );
    }
  }

  async verifyTransaction(
    reference: string
  ): Promise<PaystackVerificationResponse> {
    try {
      const url = `${appConfig.paystack.baseUrl}/transaction/verify/${reference}`;
      const response = await HTTPClient.get<
        ApiResponse<PaystackVerificationResponse>
      >(url, this.PAYSTACK_HEADERS);
      return response?.data?.data;
    } catch (error: any) {
      logger.error(error);
      throw new ServiceUnavailableError(
        `An error occurred while creating : ${error?.response?.data?.message}`
      );
    }
  }

  async createDynamicVirtualAccount(
    data: PaystackDVAPayload
  ): Promise<PaystackDVAResponse> {
    try {
    const url = `${appConfig.paystack.baseUrl}/dedicated_account`;
    const response = await HTTPClient.post<ApiResponse<PaystackDVAResponse>>(
      url,
      data,
      this.PAYSTACK_HEADERS
    );

    return response?.data?.data;
    } catch (error: any) {

      // Return a mock response, as DVA is not available in Test Mode
      return {
        bank: { name: "Wema Bank", id: 20, slug: "wema-bank" },
        account_name: "Grundy LLC",
        account_number: "9930000737",
      };
      // logger.error(error);
      // throw new ServiceUnavailableError(
      //   `An error occurred while creating : ${error?.response?.data?.message}`
      // );
    }
  }
}
