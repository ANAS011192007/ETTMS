"use client";
import { useTranslation } from "@/app/i18n/client";
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
import * as jsonData from "@/base64FontData.json";
interface DeviceInfo {
  type: string;
  manufacturer: string;
  model: string;
  serial: string;
}
interface FontData {
    base64data: string;
  }
  const fontData: FontData = jsonData as FontData;
const InfoCard = ({ trackId }: { trackId: string }) => {
  const record_summary = useRef(null);
  const searchparams = useSearchParams();
  const device_id = searchparams.get("track_id");
  const info: any = useRef(null);
  const dataList = useRef([[]]);
  const [loading, setLoading] = useState(true);
  const percentage = 100;
  const circumference = 2 * Math.PI * 30;
  const dashArray = circumference;
  const dashOffset = ((100 - percentage) / 100) * circumference;
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "TrackInfoCard");
  const JpdownloadPDF = async () => {
    const pdf = new jsPDF({

    });
    pdf.addFileToVFS("HinaMincho-Regular.ttf", fontData.base64data);
pdf.addFont('HinaMincho-Regular.ttf', 'HinaMincho-Regular', 'bold');
  
pdf.setFont('HinaMincho-Regular', 'bold'); // set font
pdf.setFontSize(10);
    // pdf.addFont(
    //   "https://cdn.glitch.com/90f6c9a8-8978-4aed-be66-e5f49d0355d3%2FMouhitsuBold.ttf?v=1614229112154",
    //   "Mouhitsu",
    //   "normal"
    // );
    // pdf.setFont("Mouhitsu", "normal");
    // pdf.setFontSize(10);
    // pdf.text(`デバイスい`, 20, 20);
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
    const tstart = `
          12/21/2023, 2:33:08 PM
      `;
    pdf.text(tstart, 86, 75);
    const tend = `
          12/21/2023, 2:40:08 PM
      `;
    pdf.text(tend, 99, 80.5);
    const req = `
          ERA>PUR>PUR
      `;
    pdf.text(req, 93, 85.8);

    const additionalInfo = `${t("body2")}`;
    pdf.text(additionalInfo, margin, 105, { maxWidth });

    const deviceDetails = [
      [
        `${t("deviceType")}`,
        `${t("manufacturer")}`,
        `${t("model")}`,
        `${t("serial")}`,
      ],
    //   [
    //     inf.data.body.device_model.device_type,
    //     inf.data.body.device_model.manufacturer,
    //     inf.data.body.device_model.model,
    //     inf.data.body.serial,
    //   ],
    ];
    console.log(deviceDetails);
    const tableX = margin;
    const tableY = 125;
    const cellPadding = 5;

    const cellWidth = maxWidth / deviceDetails[0].length;
    var cellHeight = 15;

    pdf.setFontSize(20);
    pdf.text(`${t("deviceDetails")}`, tableX, tableY - 10);
    pdf.setFontSize(15);
    deviceDetails[0].forEach((header, index) => {
      const cellX = tableX + index * cellWidth;
      const cellY = tableY;
      pdf.rect(cellX, cellY, cellWidth, cellHeight);
      pdf.text(header, cellX + cellWidth / 2, cellY + cellHeight / 2, {
        align: "center",
      });
    });
    console.log(deviceDetails);
    pdf.setFontSize(10);
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

    const recordDetails = [
      [
        `${t("recordDate")}`,
        `${t("processingType")}`,
        `${t("softwareUsed")}`,
        `${t("location")}`,
        `${t("image")}`,
      ],
    //   ...dataList.current.map((record: any) => [
    //     record["Created at"].slice(0, 10),
    //     record["Processing Type"],
    //     record["Tool Used"],
    //     record["Location"],
    //     record["Image"],
    //   ]),
    ];

    const recordTableY = tableY + 50;

    pdf.setFontSize(20);
    pdf.text(`${t("recordInformationDetails")}`, tableX, recordTableY - 10);
    pdf.setFontSize(15);
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
    // recordDetails.slice(1).forEach((row, rowIndex) => {
    //   row.forEach((cell, cellIndex) => {
    //     if (cellIndex === recordDetails[0].length - 1) {
    //       const cellX = tableX + cellIndex * cellWidthForRecord;
    //       const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

    //       const imageDataUrl =
    //         imageContainerRefs[rowIndex]?.current?.querySelector("img")?.src;
    //       const qrCodeSize = 20;

    //       const centerX = cellX + cellWidthForRecord / 2 - qrCodeSize / 2;
    //       const centerY = cellY + cellHeight / 2 - qrCodeSize / 2;

    //       pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
    //       pdf.addImage(
    //         imageDataUrl!,
    //         "JPEG",
    //         centerX,
    //         centerY,
    //         qrCodeSize,
    //         qrCodeSize
    //       );
    //     } else {
    //       const cellX = tableX + cellIndex * cellWidthForRecord;
    //       const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

    //       const cellTextArray = pdf.splitTextToSize(cell, cellWidthForRecord);
    //       pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
    //       pdf.text(
    //         cellTextArray,
    //         cellX + cellWidthForRecord / 2,
    //         cellY + cellHeight / 2,
    //         {
    //           align: "center",
    //         }
    //       );
    //     }
    //   });
    // });

    pdf.save("device_details.pdf");
  };

//   const EngdownloadPDF = async () => {
//     const access_token = localStorage.getItem("access_token");

//     const inf = await axios.post(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
//       { device_tag: trackId },
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const records = await axios.post(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/records/showAllRecordsOfFollowingDevice`,
//       { device_id: device_id },
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     dataList.current = records.data.body.map((item: any) => ({
//       id: item._id,
//       "Processing Type": item.processing_type,
//       "Created at": item.createdAt,
//       Location: item.location,
//       "Tool Used": item.tool.name_en,
//       "Recorded By": `${item.recorded_by.first_name} ${item.recorded_by.last_name}`,
//       Image: item.image_link,
//     }));

//     const pdf = new jsPDF({
//       unit: "mm",
//       format: "a4",
//       orientation: "portrait",
//     });

//     pdf.setFont("normal", "bold");
//     pdf.setFontSize(10);

//     const id = `Device ID : ${trackId}`;
//     pdf.text(id, 130, 30);

//     pdf.setFontSize(20);
//     const title = "Tracking Information Certificate For Device";
//     pdf.text(title, 40, 45);
//     pdf.setFont("normal", "normal");
//     pdf.setFontSize(13);
//     const info =
//       "Regarding the equipment listed below, the data is correct that all processing has been completed in accordance with the requested processing. It will be certified by the Association of Data Erase Certification (ADEC).";

//     const margin = 15;
//     const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

//     pdf.text(info, margin, 60, { maxWidth });

//     const specification = `
//         Tracking Start Date:
//         Tracking Completion Date:
//         Required Specifications:`;

//     pdf.setFont("normal", "bold");
//     pdf.text(specification, 40, 75);
//     pdf.setFont("normal", "normal");
//     // const tstart = `
//     //     12/21/2023, 2:33:08 PM
//     // `;
//     // pdf.text(tstart, 86, 75);
//     // const tend = `
//     //     12/21/2023, 2:40:08 PM
//     // `;
//     // pdf.text(tend, 99, 80.5);
//     // const req = `
//     //     ERA>PUR>PUR
//     // `;
//     // pdf.text(req, 93, 85.8);
//     const tstart = inf.data.body.createdAt.slice(0, 10);
//     pdf.text(tstart, 92, 80.5);
//     const tend = inf.data.body.deadline.slice(0, 10);
//     pdf.text(tend, 105, 85.5);
//     const req = inf.data.body.request_type.title_en;
//     pdf.text(req, 99, 91);

//     const additionalInfo =
//       "This document serves as proof that your company data erasure work has been completed.";
//     pdf.text(additionalInfo, margin, 105, { maxWidth });

//     const deviceDetails = [
//       ["Device Type", "Manufacturer", "Model", "Serial"],
//       [
//         inf.data.body.device_model.device_type,
//         inf.data.body.device_model.manufacturer,
//         inf.data.body.device_model.model,
//         inf.data.body.serial,
//       ],
//     ];
//     console.log(deviceDetails);
//     const tableX = margin;
//     const tableY = 125;
//     const cellPadding = 5;

//     const cellWidth = maxWidth / deviceDetails[0].length;
//     var cellHeight = 15;

//     pdf.setFontSize(17);
//     pdf.text("Device Details", tableX, tableY - 10);
//     pdf.setFontSize(14);
//     deviceDetails[0].forEach((header, index) => {
//       const cellX = tableX + index * cellWidth;
//       const cellY = tableY;
//       pdf.rect(cellX, cellY, cellWidth, cellHeight);
//       pdf.text(header, cellX + cellWidth / 2, cellY + cellHeight / 2, {
//         align: "center",
//       });
//     });
//     console.log(deviceDetails);
//     pdf.setFontSize(10);
//     deviceDetails.slice(1).forEach((row, rowIndex) => {
//       row.forEach((cell, cellIndex) => {
//         const cellX = tableX + cellIndex * cellWidth;
//         const cellY =
//           tableY + (rowIndex + 1) * cellHeight + rowIndex * cellPadding;
//         pdf.rect(cellX, cellY, cellWidth, cellHeight);
//         pdf.text(cell, cellX + cellWidth / 2, cellY + cellHeight / 2, {
//           align: "center",
//         });
//       });
//     });

//     const recordDetails = [
//       ["Record Date", "Processing Type", "Software Used", "Location", "Image"],
//       ...dataList.current.map((record: any) => [
//         record["Created at"].slice(0, 10),
//         record["Processing Type"],
//         record["Tool Used"],
//         record["Location"],
//         record["Image"],
//       ]),
//     ];

//     const recordTableY = tableY + 50;

//     pdf.setFontSize(17);
//     pdf.text("Record Information Details", tableX, recordTableY - 10);
//     pdf.setFontSize(14);
//     const cellWidthForRecord = maxWidth / recordDetails[0].length;

//     recordDetails[0].forEach((header, index) => {
//       const cellX = tableX + index * cellWidthForRecord;
//       const cellY = recordTableY;
//       pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
//       pdf.text(header, cellX + cellWidthForRecord / 2, cellY + cellHeight / 2, {
//         align: "center",
//       });
//     });
//     cellHeight = 25;
//     pdf.setFontSize(10);
//     recordDetails.slice(1).forEach((row, rowIndex) => {
//       row.forEach((cell, cellIndex) => {
//         if (cellIndex === recordDetails[0].length - 1) {
//           const cellX = tableX + cellIndex * cellWidthForRecord;
//           const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

//           const imageDataUrl =
//             imageContainerRefs[rowIndex]?.current?.querySelector("img")?.src;
//           const qrCodeSize = 20;

//           const centerX = cellX + cellWidthForRecord / 2 - qrCodeSize / 2;
//           const centerY = cellY + cellHeight / 2 - qrCodeSize / 2;

//           pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
//           pdf.addImage(
//             imageDataUrl!,
//             "JPEG",
//             centerX,
//             centerY,
//             qrCodeSize,
//             qrCodeSize
//           );
//         } else {
//           const cellX = tableX + cellIndex * cellWidthForRecord;
//           const cellY = recordTableY - 10 + (rowIndex + 1) * cellHeight;

//           const cellTextArray = pdf.splitTextToSize(cell, cellWidthForRecord);
//           pdf.rect(cellX, cellY, cellWidthForRecord, cellHeight);
//           pdf.text(
//             cellTextArray,
//             cellX + cellWidthForRecord / 2,
//             cellY + cellHeight / 2,
//             {
//               align: "center",
//             }
//           );
//         }
//       });
//     });

//     pdf.save("device_details.pdf");
//   };

  return (
    <div>
          <Button
            // onClick={lng === "en" ? EngdownloadPDF : JpdownloadPDF}
            onClick={JpdownloadPDF}
            className="border-blue-300 text-slate-500"
            variant="outline"
          >
            <MdOutlineFileDownload className="mr-2" />
            {t("SomePDF")}
          </Button>
    </div>
  );
};

export default InfoCard;
