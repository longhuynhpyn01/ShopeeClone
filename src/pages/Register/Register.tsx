import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
// Không có tính năng tree-shaking
// import { omit } from "lodash";
// Import chỉ mỗi function omit
import omit from "lodash/omit";
import authApi from "src/apis/auth.api";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { AppContext } from "src/contexts/app.context";
import { ErrorResponse } from "src/types/utils.type";
import { Schema, schema } from "src/utils/rules";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";

type FormData = Pick<Schema, "email" | "password" | "confirm_password">;

const registerSchema = schema.pick(["email", "password", "confirm_password"]);

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, "confirm_password">) => authApi.registerAccount(body)
  });

  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ["confirm_password"]);

    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true);
        setProfile(data.data.data.user);
        navigate("/");
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, "confirm_password">>>(error)) {
          const formError = error.response?.data.data;

          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, "confirm_password">, {
                message: formError[key as keyof Omit<FormData, "confirm_password">],
                type: "Server"
              });
            });
          }

          // C2: Check điều kiện nếu data trả về ít field
          // if (formError?.email) {
          //   setError("email", {
          //     message: formError.email,
          //     type: "Server"
          //   });
          // }
          // if (formError?.password) {
          //   setError("password", {
          //     message: formError.password,
          //     type: "Server"
          //   });
          // }
        }
      }
    });
  });

  return (
    <div className="bg-orange">
      <Helmet>
        <title>Đăng ký | Shopee Clone</title>
        <meta name="description" content="Đăng ký tài khoản vào dự án Shopee Clone" />
      </Helmet>
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="p-10 bg-white rounded shadow-sm" onSubmit={onSubmit} noValidate>
              <div className="text-2xl">Đăng ký</div>
              <Input
                name="email"
                register={register}
                type="email"
                className="mt-8"
                errorMessage={errors.email?.message}
                placeholder="Email"
              />
              <Input
                name="password"
                register={register}
                type="password"
                className="mt-2"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                errorMessage={errors.password?.message}
                placeholder="Password"
                autoComplete="on"
              />

              <Input
                name="confirm_password"
                register={register}
                type="password"
                className="mt-2"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                errorMessage={errors.confirm_password?.message}
                placeholder="Confirm Password"
                autoComplete="on"
              />

              <div className="mt-2">
                <Button
                  className="flex items-center justify-center w-full px-2 py-4 text-sm text-white uppercase bg-red-500 hover:bg-red-600"
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  Đăng ký
                </Button>
              </div>
              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-400">Bạn đã có tài khoản?</span>
                <Link className="ml-1 text-red-400" to="/login">
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
