"use client";
import { useTranslation } from "@/app/i18n/client";
import * as jsonData from "@/base64FontData.json";
import PieChartComponent from "@/components/chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import jsPDF from "jspdf";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCircle } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";

interface FontData {
  base64data: string;
}
const fontData: FontData = jsonData as FontData;
const TrackInfoCard = () => {
  const record_summary = useRef(null);
  const info: any = useRef(null);
  const dataList = useRef([[]]);
  const recordData = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const imageContainerRefs = recordData.map(() => useRef<HTMLDivElement>(null));
  const [loading, setLoading] = useState(true);
  const searchparams = useSearchParams();
  const device_id = searchparams.get("track_id");
  const trackId = searchparams.get("track_tag");

  const percentage = 100;
  const circumference = 2 * Math.PI * 30;
  // const dashArray = circumference;
  // const dashOffset = ((100 - percentage) / 100) * circumference;
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "TrackInfoCard");
  const JpdownloadPDF = async () => {
    const access_token = localStorage.getItem("access_token");

    const inf = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
      { device_tag: trackId },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const records = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/records/showAllRecordsOfFollowingDevice`,
      { device_id: device_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dataList.current = records.data.body.map((item: any) => {
      const createdAt = new Date(item.createdAt);

      // Format date
      const formattedDate = `${createdAt.getFullYear()}-${(
        createdAt.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")}`;

      // Format time
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

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    // pdf.addFileToVFS(
    //   "https://cdn.glitch.com/90f6c9a8-8978-4aed-be66-e5f49d0355d3%2FMouhitsuBold.ttf?v=1614229112154",
    //   ""
    // );
    // pdf.addFont(
    //   "https://cdn.glitch.com/90f6c9a8-8978-4aed-be66-e5f49d0355d3%2FMouhitsuBold.ttf?v=1614229112154",
    //   "Mouhitsu",
    //   "normal"
    // );
    // pdf.setFont("Mouhitsu", "normal");
    // pdf.setFontSize(10);
    // pdf.text(`デバイスい`, 20, 20);
    // pdf.addFileToVFS('NotoSansJP-VariableFont_wght-normal.ttf', font);
    // pdf.addFont('NotoSansJP-VariableFont_wght-normal.ttf', 'NotoSansJP-VariableFont_wght', 'normal');
    pdf.addFileToVFS("HinaMincho-Regular.ttf", fontData.base64data);
    pdf.addFont("HinaMincho-Regular.ttf", "HinaMincho-Regular", "bold");

    pdf.setFont("HinaMincho-Regular", "bold"); // set font
    pdf.setFontSize(10);
    const id = `${t("deviceid")} : ${trackId}`;
    pdf.text(id, 130, 30);

    pdf.setFontSize(20);
    const title = t("title");
    pdf.text(title, 40, 45);
    pdf.setFontSize(13);
    const info = t("body1");

    const margin = 15;
    const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

    pdf.text(info, margin, 60, { maxWidth });

    const specification = `
     ${t("startDate")}:
     ${t("endDate")}:
     ${t("requiredSpecifications")}:`;

    pdf.text(specification, 40, 75);
    // const tstart = `
    //       12/21/2023, 2:33:08 PM
    //   `;
    // pdf.text(tstart, 86, 75);
    // const tend = `
    //       12/21/2023, 2:40:08 PM
    //   `;
    // pdf.text(tend, 99, 80.5);
    // const req = `
    //       ERA>PUR>PUR
    //   `;
    // pdf.text(req, 93, 85.8);
    const tstart = inf.data.body.createdAt.slice(0, 10);
    pdf.text(tstart, 72, 80.5);
    const tend = inf.data.body.deadline.slice(0, 10);
    pdf.text(tend, 72, 85.5);
    const req = inf.data.body.request_type.title_en;
    pdf.text(req, 67, 91);
    const additionalInfo = `${t("body2")}`;
    pdf.text(additionalInfo, margin, 105, { maxWidth });

    const deviceDetails = {
      デバイスタイプ: inf.data.body.device_model.device_type,
      メーカー: inf.data.body.device_model.manufacturer,
      モデル: inf.data.body.device_model.model,
      シリアル: inf.data.body.serial,
    };

    const tableXR = 45;
    const tableYR = 125;
    const lineHeight = 10;

    pdf.setFontSize(17);
    pdf.text("Device Details", margin, tableYR - 10);

    pdf.setFontSize(14);
    Object.entries(deviceDetails).forEach(([key, value], index) => {
      const lineY = tableYR + index * lineHeight;
      pdf.text(`${key}: ${value}`, tableXR, lineY);
    });
    // const deviceDetails = [
    //   [
    //     `${t("deviceType")}`,
    //     `${t("manufacturer")}`,
    //     `${t("model")}`,
    //     `${t("serial")}`,
    //   ],
    //   [
    //     inf.data.body.device_model.device_type,
    //     inf.data.body.device_model.manufacturer,
    //     inf.data.body.device_model.model,
    //     inf.data.body.serial,
    //   ],
    // ];
    // console.log(deviceDetails);
    // const tableX = margin;
    // const tableY = 125;
    // const cellPadding = 5;

    // const cellWidth = maxWidth / deviceDetails[0].length;
    // var cellHeight = 15;

    // pdf.setFontSize(17);
    // pdf.text(`${t("deviceDetails")}`, tableX, tableY - 10);
    // pdf.setFontSize(12);
    // deviceDetails[0].forEach((header, index) => {
    //   const cellX = tableX + index * cellWidth;
    //   const cellY = tableY;
    //   pdf.rect(cellX, cellY, cellWidth, cellHeight);
    //   pdf.text(header, cellX + cellWidth / 2, cellY + cellHeight / 2, {
    //     align: "center",
    //   });
    // });
    // console.log(deviceDetails);
    // pdf.setFontSize(10);
    // deviceDetails.slice(1).forEach((row, rowIndex) => {
    //   row.forEach((cell, cellIndex) => {
    //     const cellX = tableX + cellIndex * cellWidth;
    //     const cellY =
    //       tableY + (rowIndex + 1) * cellHeight + rowIndex * cellPadding;
    //     pdf.rect(cellX, cellY, cellWidth, cellHeight);
    //     pdf.text(cell, cellX + cellWidth / 2, cellY + cellHeight / 2, {
    //       align: "center",
    //     });
    //   });
    // });
    const tableX = margin;
    const tableY = 125;
    const cellPadding = 5;

    var cellHeight = 15;
    const recordDetails = [
      [
        `${t("recordDate")}`,
        `${t("processingType")}`,
        `${t("softwareUsed")}`,
        `${t("location")}`,
        `${t("image")}`,
      ],
      ...dataList.current.map((record: any) => [
        record["Created at"],
        record["Processing Type"],
        record["Tool Used"],
        record["Location"],
        record["Image"],
      ]),
    ];

    const recordTableY = tableY + 50;

    pdf.setFontSize(17);
    pdf.text(`${t("recordInformationDetails")}`, tableX, recordTableY - 10);
    pdf.setFontSize(12);
    const cellWidthForRecord = maxWidth / recordDetails[0].length;

    recordDetails[0].forEach((header, index) => {
      const cellX = tableX + index * cellWidthForRecord;
      const cellY = recordTableY;
      pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
      pdf.text(header, cellX + cellWidthForRecord / 2, cellY + cellHeight / 2, {
        align: "center",
      });
    });
    cellHeight = 25;
    pdf.setFontSize(10);
    recordDetails.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cellIndex === recordDetails[0].length - 1) {
          const cellX = tableX + cellIndex * cellWidthForRecord;
          const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

          const imageDataUrl =
            imageContainerRefs[rowIndex]?.current?.querySelector("img")?.src;
          const qrCodeSize = 20;

          const centerX = cellX + cellWidthForRecord / 2 - qrCodeSize / 2;
          const centerY = cellY + cellHeight / 2 - qrCodeSize / 2;

          pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
          pdf.addImage(
            imageDataUrl!,
            "JPEG",
            centerX,
            centerY,
            qrCodeSize,
            qrCodeSize
          );
        } else {
          const cellX = tableX + cellIndex * cellWidthForRecord;
          const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

          const cellTextArray = pdf.splitTextToSize(cell, cellWidthForRecord);
          pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
          pdf.text(
            cellTextArray,
            cellX + cellWidthForRecord / 2,
            cellY + cellHeight / 2,
            {
              align: "center",
            }
          );
        }
      });
    });

    pdf.save("device_details.pdf");
  };

  const EngdownloadPDF = async () => {
    const access_token = localStorage.getItem("access_token");

    const inf = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
      { device_tag: trackId },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const records = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/records/showAllRecordsOfFollowingDevice`,
      { device_id: device_id },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    dataList.current = records.data.body.map((item: any) => {
      const createdAt = new Date(item.createdAt);

      const formattedDate = `${createdAt.getFullYear()}-${(
        createdAt.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${createdAt.getDate().toString().padStart(2, "0")}`;

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

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });
    pdf.addFileToVFS("HinaMincho-Regular.ttf", fontData.base64data);
    pdf.addFont("HinaMincho-Regular.ttf", "HinaMincho-Regular", "bold");
    pdf.addFont("HinaMincho-Regular.ttf", "HinaMincho-Regular", "normal");

    pdf.setFont("HinaMincho-Regular", "bold"); // set font
    // pdf.setFont("normal", "bold");
    pdf.setFontSize(10);

    const id = `Device ID : ${trackId}`;
    pdf.text(id, 130, 30);

    pdf.setFontSize(20);
    const title = "Tracking Information Certificate For Device";
    pdf.text(title, 40, 45);
    pdf.setFont("HinaMincho-Regular", "normal");
    pdf.setFontSize(13);
    const info =
      "Regarding the equipment listed below, the data is correct that all processing has been completed in accordance with the requested processing. It will be certified by the Association of Data Erase Certification (ADEC).";

    const margin = 15;
    const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

    pdf.text(info, margin, 60, { maxWidth });

    const specification = `
        Tracking Start Date:
        Tracking Completion Date:
        Required Specifications:`;

    pdf.setFont("HinaMincho-Regular", "bold");
    pdf.text(specification, 40, 75);
    pdf.setFont("HinaMincho-Regular", "normal");
    // const tstart = `
    //     12/21/2023, 2:33:08 PM
    // `;
    // pdf.text(tstart, 86, 75);
    // const tend = `
    //     12/21/2023, 2:40:08 PM
    // `;
    // pdf.text(tend, 99, 80.5);
    // const req = `
    //     ERA>PUR>PUR
    // `;
    // pdf.text(req, 93, 85.8);
    const tstart = inf.data.body.createdAt.slice(0, 10);
    pdf.text(tstart, 87, 80.5);
    const tend = inf.data.body.deadline.slice(0, 10);
    pdf.text(tend, 98, 85.5);
    const req = inf.data.body.request_type.title_en;
    pdf.text(req, 92, 91);

    const additionalInfo =
      "This document serves as proof that your company data erasure work has been completed.";
    pdf.text(additionalInfo, margin, 105, { maxWidth });

    const deviceDetails = {
      "Device Type": inf.data.body.device_model.device_type,
      Manufacturer: inf.data.body.device_model.manufacturer,
      Model: inf.data.body.device_model.model,
      Serial: inf.data.body.serial,
    };

    const tableXR = 45;
    const tableYR = 125;
    const lineHeight = 7;

    pdf.setFontSize(17);
    pdf.text("Device Details", margin, tableYR - 10);

    pdf.setFontSize(14);
    Object.entries(deviceDetails).forEach(([key, value], index) => {
      const lineY = tableYR + index * lineHeight;
      pdf.text(`${key}: ${value}`, tableXR, lineY);
    });
    // const deviceDetails = [
    //   ["Device Type", "Manufacturer", "Model", "Serial"],
    //   [
    //     inf.data.body.device_model.device_type,
    //     inf.data.body.device_model.manufacturer,
    //     inf.data.body.device_model.model,
    //     inf.data.body.serial,
    //   ],
    // ];
    // console.log(deviceDetails);
    // const tableX = margin;
    // const tableY = 125;
    // const cellPadding = 5;

    // const cellWidth = maxWidth / deviceDetails[0].length;
    // var cellHeight = 15;

    // pdf.setFontSize(17);
    // pdf.text("Device Details", tableX, tableY - 10);
    // pdf.setFontSize(14);
    // deviceDetails[0].forEach((header, index) => {
    //   const cellX = tableX + index * cellWidth;
    //   const cellY = tableY;
    //   pdf.rect(cellX, cellY, cellWidth, cellHeight);
    //   pdf.text(header, cellX + cellWidth / 2, cellY + cellHeight / 2, {
    //     align: "center",
    //   });
    // });
    // console.log(deviceDetails);
    // pdf.setFontSize(10);
    // deviceDetails.slice(1).forEach((row, rowIndex) => {
    //   row.forEach((cell, cellIndex) => {
    //     const cellX = tableX + cellIndex * cellWidth;
    //     const cellY =
    //       tableY + (rowIndex + 1) * cellHeight + rowIndex * cellPadding;
    //     pdf.rect(cellX, cellY, cellWidth, cellHeight);
    //     pdf.text(cell, cellX + cellWidth / 2, cellY + cellHeight / 2, {
    //       align: "center",
    //     });
    //   });
    // });

    const tableX = margin;
    const tableY = 125;
    const cellPadding = 5;

    var cellHeight = 15;
    const recordDetails = [
      ["Record Date", "Processing Type", "Software Used", "Location", "Image"],
      ...dataList.current.map((record: any) => [
        record["Created at"],
        record["Processing Type"],
        record["Tool Used"],
        record["Location"],
        record["Image"],
      ]),
    ];

    const recordTableY = tableY + 50;

    pdf.setFontSize(17);
    pdf.text("Record Information Details", tableX, recordTableY - 10);
    pdf.setFontSize(14);
    const cellWidthForRecord = maxWidth / recordDetails[0].length;

    recordDetails[0].forEach((header, index) => {
      const cellX = tableX + index * cellWidthForRecord;
      const cellY = recordTableY;
      pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
      pdf.text(header, cellX + cellWidthForRecord / 2, cellY + cellHeight / 2, {
        align: "center",
      });
    });
    cellHeight = 25;
    pdf.setFontSize(10);
    recordDetails.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cellIndex === recordDetails[0].length - 1) {
          const cellX = tableX + cellIndex * cellWidthForRecord;
          const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

          const imageDataUrl =
            imageContainerRefs[rowIndex]?.current?.querySelector("img")?.src;
          const qrCodeSize = 20;

          const centerX = cellX + cellWidthForRecord / 2 - qrCodeSize / 2;
          const centerY = cellY + cellHeight / 2 - qrCodeSize / 2;

          pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
          pdf.addImage(
            imageDataUrl!,
            "JPEG",
            centerX,
            centerY,
            qrCodeSize,
            qrCodeSize
          );
        } else {
          const cellX = tableX + cellIndex * cellWidthForRecord;
          const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

          const cellTextArray = pdf.splitTextToSize(cell, cellWidthForRecord);
          pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
          pdf.text(
            cellTextArray,
            cellX + cellWidthForRecord / 2,
            cellY + cellHeight / 2,
            {
              align: "center",
            }
          );
        }
      });
    });

    pdf.save("device_details.pdf");
  };

  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      const infos = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
        { device_tag: trackId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      info.current = infos.data.body;

      const device_info = {
        type: info!.current!.device_model.device_type,
        model: info!.current!.device_model.model,
        manufacturer: info!.current!.device_model.manufacturer,
        serial: info!.current!.serial,
      };
      console.log("device infos", device_info);
      const image = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/records/showAllRecordsOfFollowingDevice`,
        { device_id: device_id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      dataList.current = image.data.body.map((item: any) => ({
        id: item._id,
        Image: item.image_link,
      }));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {dataList.current.map((id: any, index) => (
        <div key={id.id} ref={imageContainerRefs[index]} className="mt-4">
          <Image
            className="hidden rounded-sm border border-black"
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${id.Image}`}
            alt="image"
            height={100}
            width={100}
          />
        </div>
      ))}
      <Card className="w-full">
        <CardHeader>
          <CardDescription>{t("DeviceInformation")}</CardDescription>
          <CardTitle>{trackId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between text-xs xl:text-sm">
            <div className="w-[35%]">
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("Status")}</div>
                <div className="w-2/3 text-orange-200">
                  {info.current?.status}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("Project")}</div>
                <div className="w-2/3">{info.current?.project.name_en}</div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("Request")}</div>
                <div className="w-2/3">
                  {info.current?.request_type.title_en}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("CreatedDate")}</div>
                <div className="w-2/3">
                  {info.current?.createdAt.slice(0, 10)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("Duration")}</div>
                <div className="w-2/3">
                  {" "}
                  {info.current?.start_date.slice(0, 10)} ~{" "}
                  {info.current?.end_date.slice(0, 10)}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/3 text-slate-500">{t("Deadline")}</div>
                <div className="w-2/3 text-red-400">
                  {info.current?.deadline.slice(0, 10)}
                </div>
              </div>
            </div>
            <div className="w-[37%] ">
              <div className="text-slate-500 font-semibold mb-1">
                {t("DeviceDetails")}
              </div>
              <div className="flex">
                <div className="w-1/2 xl:w-1/3 text-slate-500">
                  {t("DeviceType")}
                </div>

                <div className="w-1/2 xl:w-2/3">
                  {info.current?.device_model.device_type}
                </div>
              </div>
              <div className="flex">
                <div className="w-1/2 xl:w-1/3 text-slate-500">
                  {t("Serial")}
                </div>
                <div className="w-1/2 xl:w-2/3">{info.current?.serial}</div>
              </div>
              <div className="flex">
                <div className="w-1/2 xl:w-1/3 text-slate-500">
                  {t("Model")}
                </div>
                <div className="w-1/2 xl:w-2/3">
                  {info.current?.device_model.model}
                </div>
              </div>
              {/* <div className="flex flex-col xl:flex-row"> */}
              <div className="flex">
                {/* <div className="w-full xl:w-1/3 text-slate-500"> */}
                <div className="w-1/2 xl:w-1/3 text-slate-500">
                  {t("Manufacturer")}
                </div>
                {/* <div className="w-full xl:w-2/3"> */}
                <div className="w-1/2 xl:w-2/3">
                  {info.current?.device_model.manufacturer}
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 xl:w-1/3  text-slate-500">
                  {t("Specification")}
                </div>
                <div className="w-1/2 xl:w-2/3">
                  {info.current?.device_model.spacifications}
                </div>
              </div>
            </div>
            <div className="w-[28%] flex flex-row ">
              <div className="w-[70%] flex-col">
                <div className="text-slate-500 font-semibold mb-1">
                  {t("RecordSummary")}
                </div>
                <div className="flex">
                  <div className="w-3/4 text-slate-500">{t("Total")}</div>
                  <div className="w-1/4 ">
                    {info.current?.record_summary.total}
                  </div>
                </div>

                <div className="flex flex-col xl:flex-row">
                  <div className="w-full xl:w-3/4 text-slate-500">
                    <FaCircle
                      style={{
                        color: "green",
                      }}
                      className=" text-xs inline"
                    />
                    {t("Completed")}
                  </div>
                  <div className="w-full xl:w-1/4">
                    {info.current?.record_summary.completed}
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row">
                  <div className="w-full xl:w-3/4 text-slate-500">
                    <FaCircle
                      style={{
                        color: "blue",
                      }}
                      className="text-xs inline"
                    />
                    {t("Remaining")}
                  </div>
                  <div className="w-full xl:w-1/4">
                    {info.current?.record_summary.remaining}
                  </div>
                </div>
              </div>
              <div className=" flex  items-center justify-end">
                <PieChartComponent
                  completedPercentage={
                    (info.current?.record_summary.completed /
                      info.current?.record_summary.total) *
                    100
                  }
                  inProgressPercentage={0}
                  remainingPercentage={
                    (info.current?.record_summary.remaining /
                      info.current?.record_summary.total) *
                    100
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={lng === "en" ? EngdownloadPDF : JpdownloadPDF}
            // onClick={JpdownloadPDF}
            className="border-blue-300 text-slate-500"
            variant="outline"
          >
            <MdOutlineFileDownload className="mr-2" />
            {t("SomePDF")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TrackInfoCard;
