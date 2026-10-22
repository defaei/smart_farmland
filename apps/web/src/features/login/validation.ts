import { object, string, type ObjectSchema } from "yup";
import type { LoginData } from "./types";

const INVALID_LOGIN_MESSAGE = "نام کاربری یا رمز عبور صحیح نیست";

export const loginTypeSchema: ObjectSchema<LoginData> = object({
  username: string().strict().typeError(INVALID_LOGIN_MESSAGE).required("نام کاربری الزامی است."),
  password: string().strict().typeError(INVALID_LOGIN_MESSAGE).required("رمز عبور الزامی است."),
});

export const loginLenthSchema: ObjectSchema<LoginData> = object({
  username: string().strict().min(3, INVALID_LOGIN_MESSAGE).max(20, INVALID_LOGIN_MESSAGE).required(),
  password: string().strict().min(8, INVALID_LOGIN_MESSAGE).max(32, INVALID_LOGIN_MESSAGE).required(),
});
