import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from "react-toastify";

const modam = localFont({
  src: "../../public/fonts/ModamWeb-Bold.woff2",
  weight: "700",
  style: "normal",
});

export const metadata: Metadata = {
  title: "زمین کشاورزی هوشمند",
  description: "سامانه هوشمند مدیریت، پایش و بهینه‌سازی مزارع کشاورزی.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className={`${modam.className} min-h-full flex flex-col`}>
        {children}
        <ToastContainer aria-label="پیام‌های اعلان" position="top-center" rtl />
      </body>
    </html>
  );
}
