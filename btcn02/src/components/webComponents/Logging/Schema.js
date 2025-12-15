import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(30, "Tên đăng nhập không quá 30 ký tự")
      .nonempty("Tên đăng nhập là bắt buộc"),
    email: z.string()
      .email("Email không hợp lệ")
      .nonempty("Email là bắt buộc"),
    phone: z.string()
      .optional()
      .refine(val => !val || /^[0-9+\-\s()]{10,15}$/.test(val), {
        message: "Số điện thoại không hợp lệ (10-15 số)"
      }),
    dob: z.string()
      .optional()
      .refine(val => !val || !isNaN(Date.parse(val)), {
        message: "Ngày sinh không hợp lệ"
      }),
    password: z.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .nonempty("Mật khẩu là bắt buộc"),
    confirmPassword: z.string()
      .nonempty("Xác nhận mật khẩu là bắt buộc"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string()
    .nonempty("Tên đăng nhập là bắt buộc"),
  password: z.string()
    .nonempty("Mật khẩu là bắt buộc"),
});