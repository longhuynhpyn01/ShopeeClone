import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import omit from "lodash/omit";
import path from "src/constants/path";
import { Schema, schema } from "src/utils/rules";

import useQueryConfig from "./useQueryConfig";

type FormData = Pick<Schema, "name">;

const nameSchema = schema.pick(["name"]);

/**
 * Custom hook để tìm kiếm sản phẩm
 */
export default function useSearchProducts() {
  const queryConfig = useQueryConfig();

  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ""
    },
    resolver: yupResolver(nameSchema)
  });
  const navigate = useNavigate();

  const onSubmitSearch = handleSubmit((data) => {
    // omit trong trường hợp có order vê giá thì loại bỏ thêm cả sort_by (để reset về mới nhất)
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ["order", "sort_by"]
        )
      : {
          ...queryConfig,
          name: data.name
        };

    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    });
  });
  return { onSubmitSearch, register };
}
