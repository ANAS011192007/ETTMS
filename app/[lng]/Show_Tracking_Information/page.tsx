"use client";
import React from "react";
import InfoCard from "./information_card/page";
import TrackingCard from "./tracking_information_card/page";
import { useSearchParams } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

function ShowTrackingInformationPage() {
  const searchparams = useSearchParams();
  const trackId = searchparams.get("track_id");
  const tracktag = searchparams.get("track_tag");
  console.log(tracktag);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1 ">
          <NavbarPage />
          <div className="p-4 w-[80%] ml-8">
            <InfoCard trackId={tracktag!} />
          </div>
          <div className="p-4 w-[80%] ml-8 ">
            <TrackingCard trackId={trackId!} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowTrackingInformationPage;
