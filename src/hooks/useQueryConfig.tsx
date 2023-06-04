import isUndefined from "lodash/isUndefined";
import omitBy from "lodash/omitBy";
import { ProductListConfig } from "src/types/product.type";

import useQueryParams from "./useQueryParams";

/**
 * Tạo kiểu `QueryConfig` để những component con có thể sử dụng một vài thuộc tính trong `ProductListConfig`
 */

export type QueryConfig = {
  [key in keyof ProductListConfig]: string;
};

/**
 * Custom hook để lưu những trường cần query
 */
export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams();
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || "1",
      limit: queryParams.limit || "20",
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      name: queryParams.name,
      order: queryParams.order,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined // nhằm loại bỏ những field có giá trị là undefined
  );
  return queryConfig;
}
