"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";
import { useTranslation } from "@/app/i18n/client";
import { useEffect } from "react";

const LogoutPage = () => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "Signout");
  const router = useRouter();

  const handleSignOut = async () => {
    // Clear localStorage
    localStorage.clear();

    // Redirect to the login page
    router.push("/Login");
  };
  const handleCancel = async () => {
    // Redirect to the login page
    router.push("Device_registration");
  };
  const checkLoginStatus = async () => {
    if (localStorage.getItem("access_token") === undefined)
    console.log(localStorage.getItem("access_token"))
      router.push("/Login");
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1 ">
          <NavbarPage />
          <div className="flex items-center justify-center h-[89.8%] bg-gray-200">
            <Card className="bg-white p-4 rounded-xl">
              <div className="container">
                <div className="text-center">
                  <h1 className="text-2xl mb-4">{t("Signout")}</h1>
                  <p className="mb-4">{t("Sure")}</p>
                  <div className="flex justify-center">
                    <Button onClick={handleCancel} className="w-1/4 mr-2">
                      {t("No")}
                    </Button>
                    <Button onClick={handleSignOut} className="w-1/4 ">
                      {t("Yes")}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
