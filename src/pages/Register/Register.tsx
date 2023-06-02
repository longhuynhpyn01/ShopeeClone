import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { yupResolver } from "@hookform/resolvers/yup";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { Schema, schema } from "src/utils/rules";

type FormData = Pick<Schema, "email" | "password" | "confirm_password">;

const registerSchema = schema.pick(["email", "password", "confirm_password"]);

export default function Register() {
  const {
    register,
    handleSubmit,
    // setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  });

  const onSubmit = handleSubmit((data) => {
    // const body = omit(data, ["confirm_password"]);
    console.log("data:", data);
  });

  console.log("errors:", errors);

  return (
    <div className="bg-orange">
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
                  // isLoading={registerAccountMutation.isLoading}
                  // disabled={registerAccountMutation.isLoading}
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
