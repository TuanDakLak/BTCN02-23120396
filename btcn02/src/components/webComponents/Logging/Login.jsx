import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./schema";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card.jsx";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const onSubmit = async (values) => {
    try {
      setLoginError("");
      const user = await login(values.username, values.password);

      if (user) {
        navigate("/");
      } else {
        setLoginError("Sai tên đăng nhập hoặc mật khẩu!");
      }
    } catch (e) {
      console.error("Lỗi đăng nhập:", e);
      setLoginError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
          <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
          <p className="text-center text-blue-100 text-sm mt-2">
            Đăng nhập để tiếp tục
          </p>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {loginError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {loginError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  {...register("username")}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  {...register("password")}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-4 mt-8 p-0">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
