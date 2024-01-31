"use client";
import { useTranslation } from "@/app/i18n/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrackingCard = () => {
  const dataList = useRef([[]]);
  const info = useRef(null);
  const [loading, setLoading] = useState(true);
  const searchparams = useSearchParams();
  const device_id = searchparams.get("track_id");
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "TrackTable");
  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      console.log(device_id);
      const infos = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/records/showAllRecordsOfFollowingDevice`,
        { device_id: device_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      info.current = infos.data.body;
      console.log("sadas", info.current!);
      // dataList.current = infos.data.body.map((item: any) => ({

      //   // id: item._id,
      //   // "Processing Type": item.processing_type,
      //   // "Created at": item.createdAt,
      //   // Location: item.location,
      //   // "Tool Used": item.tool.name_en,
      //   // "Recorded By": `${item.recorded_by.first_name} ${item.recorded_by.last_name}`,
      //   // Image: item.image_link,
      // }));
      dataList.current = infos.data.body.map((item: any) => {
        const createdAt = new Date(item.createdAt);

        const formattedDate = `${createdAt.getFullYear()}-${(
          createdAt.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${createdAt
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const formattedTime = createdAt.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return {
          id: item._id,
          "Processing Type": item.processing_type,
          "Created at": `${formattedDate}\n${formattedTime}`,
          Location: item.location,
          "Tool Used": item.tool.name_en,
          "Recorded By": `${item.recorded_by.first_name} ${item.recorded_by.last_name}`,
          Image: item.image_link,
        };
      });
      console.log(dataList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching session data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full ">
      <div className="flex justify-between items-end">
        <div className="text-slate-500 ml-4 text-base">{t("TrackInfo")}</div>
      </div>
      <div className="border border-black rounded-md h-1/3 overflow-auto">
        <Table className="border-black rounded-lg w-full">
          <TableHeader className="text-center bg-slate-600 text-white">
            <TableRow className="text-center">
              <TableHead>{t("ProcessingType")}</TableHead>
              <TableHead>{t("CreatedAt")}</TableHead>
              <TableHead>{t("Location")}</TableHead>
              <TableHead>{t("ToolUsed")}</TableHead>
              <TableHead>{t("RecordedBy")}</TableHead>
              <TableHead>{t("Image")}</TableHead>
              {/* <TableHead>{t("Action")}</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {dataList.current!.length ? (
              dataList.current!.map((data: any) => (
                <TableRow className="" key={data["id"]}>
                  <TableCell className="font-medium">
                    {t("pType", { processingType: data["Processing Type"] })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {data["Created at"]}
                  </TableCell>
                  <TableCell>{data.Location}</TableCell>
                  <TableCell>{data["Tool Used"]}</TableCell>
                  <TableCell>{data["Recorded By"]}</TableCell>
                  <TableCell>
                    <Image
                      className="rounded-sm border border-black"
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}/${data["Image"]}`}
                      alt="image"
                      height={100}
                      width={100}
                    />
                  </TableCell>
                  {/* <TableCell className="flex justify-end flex-col ">
                  <DeleteButton trackingData={data} buttonName={t("Delete")} />
                </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TrackingCard;
