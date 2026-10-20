import BrandIcon from "./brand-icon";
import LoginForm from "./login-form";
import ReduxWrapper from "@/shared/redux/redux-wrapper";

export default function LoginContent() {
  return (
    <section className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
      <div className="mb-12 inline-flex w-fit items-center gap-3 text-foreground" aria-label="صفحه اصلی مزرعه‌یار">
        <BrandIcon />
        <span>
          <span className="block text-lg font-bold">مزرعه‌یار</span>
          <span className="block text-xs text-muted-foreground">مدیریت هوشمند مزرعه</span>
        </span>
      </div>

      <div className="mb-8">
        <p className="mb-3 text-sm font-bold text-primary">خوش آمدید</p>
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl">وارد حساب خود شوید</h1>
        <p className="text-sm leading-7 text-muted-foreground">برای ادامه‌ی مدیریت و پایش مزرعه، اطلاعات حساب کاربری‌تان را وارد کنید.</p>
      </div>

      <ReduxWrapper>
        <LoginForm />
      </ReduxWrapper>

      <p className="mt-10 text-center text-xs text-muted-foreground">با ورود به سامانه، استفاده از خدمات مزرعه‌یار را می‌پذیرید.</p>
    </section>
  );
}
