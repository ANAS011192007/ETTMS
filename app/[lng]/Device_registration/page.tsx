"use client";
import QRCodePage from "@/components/QRCode";
import React from "react";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

function DeviceRegistrationPage() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1 ">
          <NavbarPage />
          <QRCodePage Page="Device" />
        </div>
      </div>
    </div>
  );
}

export default DeviceRegistrationPage;
