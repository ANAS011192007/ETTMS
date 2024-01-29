"use client";
import QRCodePage from "@/components/QRCode";
import React, { useEffect } from "react";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";
import { useRouter } from "next/navigation";

const DeviceRegistrationPage = () => {
  const router = useRouter();
  const checkLoginStatus = async () => {
    console.log(localStorage.getItem("access_token"));
    if (localStorage.getItem("access_token") === null) {
      console.log("a");
      router.push("/Login");
    }
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1">
          <NavbarPage />
          <QRCodePage Page="Device" />
        </div>
      </div>
    </div>
  );
};

export default DeviceRegistrationPage;
