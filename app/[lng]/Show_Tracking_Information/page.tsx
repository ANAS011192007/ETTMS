"use client";
import React, { useEffect } from "react";
import TrackInfoCard from "./information_card/page";
import TrackingCard from "./tracking_information_card/page";
import { useRouter, useSearchParams } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

const ShowTrackingInformationPage = () => {
  const searchparams = useSearchParams();
  const trackId = searchparams.get("track_id");
  const tracktag = searchparams.get("track_tag");
  console.log(tracktag);
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
          <div className="p-4 w-[80%] ml-8">{/* <TrackInfoCard /> */}</div>
          <div className="p-4 w-[80%] ml-8 ">
            <TrackingCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowTrackingInformationPage;
