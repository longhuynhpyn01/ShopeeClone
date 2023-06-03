import { toast } from "react-toastify";

import axios, { AxiosError, type AxiosInstance } from "axios";
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from "src/apis/auth.api";
import config from "src/constants/config";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { AuthResponse } from "src/types/auth.type";

import {
  clearLS,
  getAccessTokenFromLS,
  getRefreshTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
  setRefreshTokenToLS
} from "./auth";

// Purchase: 1 - 3
// Me: 2 - 5
// Refresh Token cho purchase: 3 -  4
// Gọi lại Purchase: 4 - 6
// Refresh Token mới cho me: 5 - 6
// Gọi lại Me: 6

class Http {
  // để chỉ dùng trong class Http
  instance: AxiosInstance;
  private accessToken: string; // tạo biến dùng trong class vì lưu trong RAM nhanh hơn lưu trong localStorage (trong ổ cứng)
  private refreshToken: string;
  // private refreshTokenRequest: Promise<string> | null;

  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.refreshToken = getRefreshTokenFromLS();
    // this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
        "expire-access-token": 60 * 60 * 24, // 1 ngày
        "expire-refresh-token": 60 * 60 * 24 * 160 // 160 ngày
      }
    });

    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    this.instance.interceptors.response.use(
      // dùng arrow function thì mới truy cập được đến this
      (response) => {
        const { url } = response.config;

        if (url === URL_LOGIN || url === URL_REGISTER) {
          const data = response.data as AuthResponse;
          this.accessToken = data.data.access_token;
          this.refreshToken = data.data.refresh_token;

          setAccessTokenToLS(this.accessToken);
          setRefreshTokenToLS(this.refreshToken);
          setProfileToLS(data.data.user);
        } else if (url === URL_LOGOUT) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLS();
        }

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
