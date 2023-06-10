import axios, { AxiosError } from "axios";
import userImage from "src/assets/images/user.svg";
import config from "src/constants/config";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import { ErrorResponse } from "src/types/utils.type";

/**
 * Hàm ép kiểu error thành AxiosError với <T> là generic type đầu vào do ta quy định
 */
export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

/**
 * Hàm check lỗi 422: UnprocessableEntity
 */
export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}

export function isAxiosUnauthorizedError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === "EXPIRED_TOKEN"
  );
}

/**
 * Format cho giá tại product card
 */
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(currency);
}
/**
 * Format cho số lượng bán tại product card => hiển thị k (nghìn), m (triệu), b (tỉ), t (nghìn tỉ)
 */
export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  })
    .format(value)
    .replace(".", ",")
    .toLowerCase();
}

/**
 * Hàm tính toán tỉ lệ giảm dựa vào 2 tham số là `original` và `sale`
 */
export const rateSale = (original: number, sale: number) => Math.round(((original - sale) / original) * 100) + "%";

/**
 * Hàm xóa các ký tự đặc biệt trên bàn phím
 */
const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, "");

/**
 * Hàm để tạo ra url dựa vào `name` và `id`
 */
export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, "-") + `-i-${id}`;
};

/**
 * Hàm để parse url từ `generateNameId` thành `id`
 */
export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split("-i-");
  return arr[arr.length - 1];
};

/**
 * Hàm dựa vào `avatarName` để tạo ra url image
 */
export const getAvatarUrl = (avatarName?: string) => (avatarName ? `${config.baseUrl}images/${avatarName}` : userImage);
