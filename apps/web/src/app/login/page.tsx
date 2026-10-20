import LoginContent from "@/features/login/components/login-content";
import LoginPromoPanel from "@/features/login/components/login-promo-panel";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm sm:min-h-[calc(100vh-5rem)] lg:grid lg:grid-cols-[1fr_1.05fr]">
        <LoginContent />
        <LoginPromoPanel />
      </div>
    </main>
  );
}
