"use client";
import QRScanPage from "@/components/QRScan";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

const DeviceScanPage = () => {
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
