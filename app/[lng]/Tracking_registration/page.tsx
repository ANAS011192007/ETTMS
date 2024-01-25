"use client";
import QRCodePage from "@/components/QRCode";
import { useSearchParams } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

function TrackingRegistrationPage() {
  const searchparams = useSearchParams();
  const trackId = searchparams.get("track_id");
  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1 ">
          <NavbarPage />
          <QRCodePage Page="Track" trackId={trackId || undefined} />
        </div>
      </div>
    </div>
  );
}

export default TrackingRegistrationPage;
