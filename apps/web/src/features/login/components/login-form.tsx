"use client";
import EyeHideButton from "./eye-hide-button";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { setLoginData, togglePasswordVisibility } from "../slice";
import { useLoginSubmit } from "../hooks/use-login-submit";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { isPasswordVisible, data } = useAppSelector((state) => state.login);
  const submitLogin = useLoginSubmit();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitLogin();
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-bold">
          نام کاربری
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={data.username}
          onChange={(event) => dispatch(setLoginData({ field: "username", value: event.target.value }))}
          autoComplete="username"
          placeholder="نام کاربری خود را وارد کنید"
          className="h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-bold">
          رمز عبور
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            value={data.password}
            onChange={(event) => dispatch(setLoginData({ field: "password", value: event.target.value }))}
            autoComplete="current-password"
            placeholder="رمز عبور خود را وارد کنید"
            className="h-12 w-full rounded-lg border border-border bg-surface px-4 pl-16 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <button
            type="button"
            onClick={() => dispatch(togglePasswordVisibility())}
            className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={isPasswordVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
            title={isPasswordVisible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
          >
            <EyeHideButton />
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        ورود به حساب
      </button>
    </form>
  );
}
