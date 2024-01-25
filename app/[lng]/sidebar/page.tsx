"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { HiOutlineDeviceTablet } from "react-icons/hi2";
import { MdShowChart } from "react-icons/md";
import { TbDeviceDesktopSearch, TbLogout2 } from "react-icons/tb";
import { TfiAgenda } from "react-icons/tfi";
import { useTranslation } from "../../i18n/client";

const SidebarPage = () => {
  let session;
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "sidebar");
  console.log(pathname);
  let accessToken;
  // const fetchData = async () => {
  //   try {
  //     accessToken.current = localStorage.getItem("access_token")!;
  //     console.log("navbar", accessToken);
  //     console.log(accessToken);
  //   } catch (error: any) {}
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);
  // if (!accessToken.current) {
  //   return null;
  // }
  if (typeof localStorage !== "undefined") {
    accessToken = localStorage.getItem("access_token");
  }
  return (
    <div className="flex flex-col items-center min-h-screen w-1/3 p-2 text-left border-x-2 sm:w-1/5">
      <h1 className="text-slate-600 text-xl font-bold mt-10 mb-16">ETTMS</h1>
      <div className="ml-4">
        <Link href={`/${lng}/Device_registration`}>
          <div className="mb-4 flex items-center text-start">
            <HiOutlineDeviceTablet className="text-xl" />
            <div
              className={`${
                pathname === `/${lng}/Device_registration` ||
                pathname === `/${lng}/Device_registration/form`
                  ? "font-bold"
                  : "font-medium"
              } text-slate-600 ml-1`}
            >
              {t!("Device Registration")}
            </div>
          </div>
        </Link>
        <Link href={`/${lng}/Device_Scan`}>
          <div className="mb-4 flex items-center text-start">
            <TbDeviceDesktopSearch className="text-xl" />
            <div
              className={`${
                pathname === `/${lng}/Device_Scan` ||
                pathname === `/${lng}/Show_Device_Information`
                  ? "font-bold"
                  : "font-medium"
              } text-slate-600 ml-1`}
            >
              {t!("Show Device Information")}
            </div>
          </div>
        </Link>
        <Link href={`/${lng}/Tracking_registration`}>
          <div className="mb-4 flex items-center text-start">
            <MdShowChart className="bg-slate-700 text-white text-l rounded " />
            <div
              className={`${
                pathname === `/${lng}/Tracking_registration` ||
                pathname === `/${lng}/Tracking_registration/form`
                  ? "font-bold"
                  : "font-medium"
              } text-slate-600 ml-1`}
            >
              {t!("Tracking Registration")}
            </div>
          </div>
        </Link>
        <Link href={`/${lng}/Track_Scan`}>
          <div className="mb-4 flex items-center text-start">
            <TfiAgenda className="" />
            <div
              className={`${
                pathname === `/${lng}/Track_Scan` ||
                pathname === `/${lng}/Show_Tracking_Information`
                  ? "font-bold"
                  : "font-medium"
              } text-slate-600 ml-1`}
            >
              {t!("Show Tracking information")}
            </div>
          </div>
        </Link>
        <Link href={`/${lng}/Logout`}>
          <div className="flex items-center text-start">
            <TbLogout2 className="text-l" />
            <div className="text-slate-600 font-medium ml-1">
              {t!("Logout")}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SidebarPage;
