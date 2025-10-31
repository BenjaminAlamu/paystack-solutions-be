import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import * as http from 'http';
import * as https from 'https';
import {ApiResponse} from "@shared/dtos/http-client.dto";

// Utility function to ensure headers are Record<string, string>
function transformHeaders(headers: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = String(value); // Ensure each value is a string
    }
  });
  return result;
}

class HTTPClient {
  static create(config: AxiosRequestConfig): AxiosInstance {
    config.httpAgent = new http.Agent({ keepAlive: true });
    config.httpsAgent = new https.Agent({ keepAlive: true });
    config.headers = Object.assign({ 'content-type': 'application/json', accept: 'application/json' }, config.headers);

    return axios.create(config);
  }

  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const client = this.create(config || {});
    const response: AxiosResponse<T> = await client.get(url);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: transformHeaders(response.headers), 
      config: response.config,
    };
  }

  static async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    // Default headers
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Merge headers from the provided config
    const headers = {
        ...defaultHeaders,
        ...(config?.headers || {}),
    };

    // Create an Axios client with merged config
    const client = this.create({
        ...config,
        headers,
    });

    // Perform the POST request
    const response: AxiosResponse<T> = await client.post(url, data);

    // Return the response
    return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: transformHeaders(response.headers), 
        config: response.config,
    };
}


}

export default HTTPClient;
