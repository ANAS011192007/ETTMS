import { Toaster } from "@/components/ui/sonner";
import { dir } from "i18next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { languages } from "../i18n/settings";
import NavbarPage from "./navbar/page";
import SidebarPage from "./sidebar/page";
import LoginPage from "./Login/page";
// const languages = ["en", "ja"];
const inter = Inter({ subsets: ["latin"] });
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}
export const metadata: Metadata = {
  title: "ETTMS",
  description: "Created by Ultra-X BD",
};
interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}
export default async function RootLayout({
  children,
  params: { lng },
}: RootLayoutProps) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body className={inter.className}>
        {/* <div className="flex flex-col h-screen">
          <div className="flex"> */}
        {/* <SidebarPage /> */}
        {/* <div className="flex-1 "> */}
        {/* <NavbarPage params={{ lng }} /> */}
        {children}
        {/* </div> */}
        {/* </div>
        </div> */}
        <Toaster />
      </body>
    </html>
  );
}
