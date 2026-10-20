"use client";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { setLoginData, togglePasswordVisibility } from "../slice";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { isPasswordVisible, data } = useAppSelector((state) => state.login);

  return (
    <form className="space-y-5">
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
          required
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
            required
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
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              {isPasswordVisible ? (
                <>
                  <path d="m3 3 18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.1-1.1 2.4-2.3 3.6" />
                  <path d="M6.2 6.2C4.5 7.4 3.4 9.1 3 12c.7 2.5 4 7 9 7 1.1 0 2.1-.2 3-.6" />
                </>
              ) : (
                <>
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
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
