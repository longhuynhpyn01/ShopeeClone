import { Link } from "react-router-dom";

import Button from "src/components/Button";
import Input from "src/components/Input";

export default function Login() {
  return (
    <div className="bg-orange">
      <div className="container">
        <div className="grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10">
          <div className="lg:col-span-2 lg:col-start-4">
            <form className="p-10 bg-white rounded shadow-sm" noValidate>
              <div className="text-2xl">Đăng nhập</div>
              <Input name="email" type="email" className="mt-8" placeholder="Email" />
              <Input
                name="password"
                type="password"
                className="mt-2"
                classNameEye="absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]"
                placeholder="Password"
                autoComplete="on"
              />
              <div className="mt-3">
                <Button
                  type="submit"
                  className="flex items-center justify-center w-full px-2 py-4 text-sm text-white uppercase bg-red-500 hover:bg-red-600"
                >
                  Đăng nhập
                </Button>
              </div>
              <div className="flex items-center justify-center mt-8">
                <span className="text-gray-400">Bạn chưa có tài khoản?</span>
                <Link className="ml-1 text-red-400" to="/register">
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
