"use client";
import QRScanPage from "@/components/QRScan";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

const DeviceScanPage = () => {
  const router = useRouter();
  const checkLoginStatus = async () => {
    if (localStorage.getItem("access_token") === null) {
      console.log(localStorage.getItem("access_token"));
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
        <div className="flex-1 ">
          <NavbarPage />
          <QRScanPage Page="Device" />
        </div>
      </div>
    </div>
  );
};

export default DeviceScanPage;
