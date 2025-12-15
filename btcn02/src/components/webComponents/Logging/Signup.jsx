import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "./schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(registerSchema) });

  const navigate = useNavigate();
  const [signupError, setSignupError] = useState("");
  const { signup } = useAuth();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setSignupError("");
      
      const userData = {
        username: data.username,
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        dob: data.dob || ""
      };

      const result = await signup(userData);

      if (result.success) {
        setSuccessMessage(result.message || "Đăng ký thành công!");
        setSignupSuccess(true);
        reset();
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSignupError(result.error || "Đã xảy ra lỗi khi đăng ký");
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSignupError(error.message || "Đã xảy ra lỗi khi đăng ký");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl overflow-hidden">
        <CardHeader >
          <CardTitle className="text-2xl text-center">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-center">
            Tạo tài khoản mới để bắt đầu
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {signupSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-center">
                 {successMessage} ! Đang chuyển hướng đến trang đăng nhập...
              </p>
            </div>
          )}

          {signupError && !signupSuccess && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">
                {signupError}
              </p>
            </div>
          )}

          <form id="signupForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                  Tên đăng nhập *
                </Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập"
                  {...register("username")}
                  className="w-full"
                  disabled={isSubmitting || signupSuccess}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register("email")}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại (tùy chọn)"
                  {...register("phone")}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-gray-700 dark:text-gray-300">
                  Ngày sinh
                </Label>
                <Input
                  id="dob"
                  type="date"
                  {...register("dob")}
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Mật khẩu *
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Xác nhận mật khẩu *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...register("confirmPassword")}
                  className="w-full"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <CardFooter className="flex-col gap-4 mt-8 p-0">
              <Button 
                type="submit" 
                form="signupForm" 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                disabled={isSubmitting || signupSuccess}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Đang đăng ký...</span>
                  </div>
                ) : (
                  "Đăng ký"
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Đã có tài khoản?{" "}
                  <Link 
                    to="/login" 
                    className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline"
                  >
                    Đăng nhập ngay
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