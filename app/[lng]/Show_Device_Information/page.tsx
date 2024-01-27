"use client"
import React, { useEffect } from "react";
import InfoCard from "./information_card/page";
import TrackingCard from "./tracking_information_card/page";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";
import { useRouter } from "next/navigation";

function ShowTrackingInformationPage() {
  const router = useRouter()
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
          <div className="p-4 w-[90%] ml-8">
            <InfoCard />
          </div>
          <div className="p-4 w-[90%] ml-8">
            <TrackingCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowTrackingInformationPage;
