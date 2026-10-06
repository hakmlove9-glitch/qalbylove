import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/app/context/AuthContext";
import FloatingChat from "@/components/chat/FloatingChat";
import AssistantCompanion from "@/components/member/AssistantCompanion";
import InactivityGuard from "@/components/auth/InactivityGuard";
import ConditionalPublicHeader from "@/components/shared/ConditionalPublicHeader";
import ClientSecurityUX from "@/components/shared/ClientSecurityUX";


export const metadata: Metadata = {
  metadataBase: new URL("https://qalbylove.com"),
  title: { default: "قلبي لوڤي", template: "%s | قلبي لوڤي" },
  description: "منصة مصرية حديثة للزواج الجاد، بتجربة آمنة ودافئة وواضحة.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "قلبي لوڤي",
    description: "ابدأ حكاية جادة في مساحة أكثر دفئًا ووضوحًا.",
    url: "https://qalbylove.com",
    siteName: "قلبي لوڤي",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body dir="rtl">
        <AuthProvider>
          <ConditionalPublicHeader />
          <ClientSecurityUX />
          {children}
          <InactivityGuard />
          <FloatingChat />
          <AssistantCompanion />
        </AuthProvider>
      </body>
    </html>
  );
}
