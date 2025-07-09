import axios, { AxiosError, AxiosResponse } from "axios";
import { getToken } from "./session.utils";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export class ApiUtils {
  static async get<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<T> {
    try {
      //const token = getToken();
      //const headersWithAuth = { token: token };
      const response = await axios.get(url, {
        params,
        //headers: headersWithAuth,
      });
      return response.data as T;
    } catch (error) {
      throw Error("Error sending request");
    }
  }

  /**
   * Performs a POST request and returns data of generic type T
   * @param url - The URL to send data to
   * @param data - The payload to send in the request body
   * @param headers - Any additional headers to include in the request
   * @returns A promise of generic type T
   */
  static async post<T = any>(
    url: string,
    data: any, // Record<string, any>,
    headers?: Record<string, any>
  ): Promise<T> {
    try {
      const token = getToken();
      const headersWithAuth = { ...headers, token: token };
      // Perform POST request with axios
      const response: AxiosResponse<T> = await axios.post<T>(url, data, {
        headers: headersWithAuth,
      });

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error(
          `Error posting data: ${axiosError.response.status} - ${axiosError.response.statusText}`
        );
      } else if (axiosError.request) {
        console.error("Error posting data: No response received");
      } else {
        console.error(`Error creating request: ${axiosError.message}`);
      }

      // Throw a specific Error class based on the kind of error.
      throw new Error("Error sending request");
    }
  }

    static async delete(
    url: string,
    headers?: Record<string, any>
  ): Promise<void> {
    try {
      const token = getToken();
      const headersWithAuth = { ...headers, token: token };
      await axios.delete(url, { headers: headersWithAuth });
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        console.error(
          `Error deleting data: ${axiosError.response.status} - ${axiosError.response.statusText}`
        );
      } else if (axiosError.request) {
        console.error("Error deleting data: No response received");
      } else {
        console.error(`Error creating request: ${axiosError.message}`);
      }

      throw new Error("Error sending delete request");
    }
  }
}
