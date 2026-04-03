import type { Metadata } from "next";
import { cookies } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { LocaleProvider } from "@/lib/i18n-client";
import { LOCALE_COOKIE, DEFAULT_LOCALE } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CLIProxyAPI Dashboard",
    template: "%s | CLIProxyAPI",
  },
  description: "Management dashboard for CLIProxyAPI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value || DEFAULT_LOCALE;

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <LocaleProvider initialLocale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
