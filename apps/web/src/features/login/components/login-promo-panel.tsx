export default function LoginPromoPanel() {
  return (
    <aside className="relative isolate hidden min-h-72 flex-col justify-between overflow-hidden bg-primary p-7 text-primary-foreground sm:p-10 lg:flex lg:min-h-full lg:p-14">
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.18)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute -bottom-40 -right-20 size-[28rem] rounded-full border border-primary-foreground/40" />
        <div className="absolute -bottom-28 -right-8 size-[22rem] rounded-full border border-primary-foreground/40" />
        <div className="absolute -bottom-16 right-4 size-64 rounded-full border border-primary-foreground/40" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full border border-primary-foreground/30 px-3 py-1.5 text-xs">سامانه‌ی یکپارچه کشاورزی</span>
        <span className="size-2 rounded-full bg-accent" aria-label="سامانه فعال" />
      </div>

      <div className="py-10 lg:py-0">
        <p className="mb-4 text-sm text-primary-foreground/75">از خاک تا برداشت، یک قدم جلوتر</p>
        <h2 className="max-w-lg text-3xl font-bold leading-relaxed sm:text-4xl">
          تصمیم‌های دقیق‌تر،
          <br />
          برای مزرعه‌ای پربارتر
        </h2>
      </div>

      <div className="flex items-end justify-between gap-4 border-t border-primary-foreground/20 pt-5 text-xs text-primary-foreground/75">
        <span>پایش · تحلیل · مدیریت</span>
        <span>مزرعه‌یار</span>
      </div>
    </aside>
  );
}