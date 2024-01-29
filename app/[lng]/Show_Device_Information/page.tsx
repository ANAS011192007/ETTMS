"use client";
import React, { useEffect } from "react";
import DeviceInfoCard from "./information_card/page";
import DeviceTrackingCard from "./tracking_information_card/page";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";
import { useRouter } from "next/navigation";

const ShowDeviceTrackingInformationPage = () => {
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
          <div className="p-4 w-[90%] ml-8">{/* <DeviceInfoCard /> */}</div>
          <div className="p-4 w-[90%] ml-8">
            <DeviceTrackingCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDeviceTrackingInformationPage;
