/**
 * Trả về response khi thành công
 */
export interface SuccessResponse<Data> {
  message: string;
  data: Data;
}

/**
 * Trả về response khi thất bại
 */
export interface ErrorResponse<Data> {
  message: string;
  data?: Data;
}

/**
 * Cú pháp `-?` sẽ loại bỏ undefiend của key optional
 */
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};
