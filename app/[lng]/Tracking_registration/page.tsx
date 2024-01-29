"use client";
import QRCodePage from "@/components/QRCode";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";
import { useEffect } from "react";

const TrackingRegistrationPage = () => {
  const searchparams = useSearchParams();
  const trackId = searchparams.get("track_id");
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
          <QRCodePage Page="Track" trackId={trackId || undefined} />
        </div>
      </div>
    </div>
  );
};

export default TrackingRegistrationPage;
