import { toast } from "react-toastify";

import axios, { AxiosError, type AxiosInstance } from "axios";
import config from "src/constants/config";
import HttpStatusCode from "src/constants/httpStatusCode.enum";

// Purchase: 1 - 3
// Me: 2 - 5
// Refresh Token cho purchase: 3 -  4
// Gọi lại Purchase: 4 - 6
// Refresh Token mới cho me: 5 - 6
// Gọi lại Me: 6

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 60 * 60 * 24, // 1 ngày
        "expire-refresh-token": 60 * 60 * 24 * 160 // 160 ngày
      }
    });

    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        // Không nên dùng isAxiosUnprocessableEntityError để check vì nó sẽ làm error thành kiểu never, không còn là kiểu AxiosError

        console.log("ERROR:", error);
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data;
          const message = data?.message || error.message;
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }
}
const http = new Http().instance;

export default http;
