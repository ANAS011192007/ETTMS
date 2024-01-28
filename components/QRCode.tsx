"use client";
import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import QRCode from "react-qr-code";
import { useZxing } from "react-zxing";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import axios from "axios";

const QRCodePage = ({ Page, trackId }: { Page: string; trackId?: string }) => {
  const [data, setData] = useState("No result");
  const [showQRReader, setShowQRReader] = useState(false);
  const router = useRouter();
  const { ref } = useZxing({
    onDecodeResult(result) {
      setData(result.getText());
      console.log(data);
      handleDecodedData(result.getText());
    },
    paused: !showQRReader,
  });

  const handleDecodedData = async (data: string) => {
    const params = new URLSearchParams();
    if (data !== "No Result") {
      if (Page === "Device") {
        if (data.length === 17) {
          if (data) params.append("device_id", data);
          const query = params.size ? "?" + params.toString() : "";
          router.push("Device_registration/form" + query);
        } else {
          toast.error("Not a valid Track ID");
        }
      } else {
        if (data.length >= 19) {
          try {
            if (data) params.append("track_id", data);

            const query = params.size ? "?" + params.toString() : "";
            const access_token = localStorage.getItem("access_token");
            const deviceidres = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
              { device_tag: data },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            // console.log(deviceid.current);
            const processingres = await axios.post(
              `${process.env.NEXT_PUBLIC_BASE_URL}/devices/findCurrentProcessingTypeOfFollowingDevice`,
              { device_id: deviceidres.data.body._id },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            router.push("Tracking_registration/form" + query);
          } catch (error: any) {
            if (error.response && error.response.status === 409) {
              toast.error("All Processing Types are full");
            } else {
              toast.error("Device not registered");
            }
          }
        } else {
          toast.error("Not a valid Device ID");
        }
      }
    }
  };

  const handleQRButtonClick = () => {
    setShowQRReader(true);
  };

  const handleStopButtonClick = () => {
    setShowQRReader(false);
    // window.location.reload();
  };
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "QRCode");
  return (
    <div>
      <div className="text-center p-4 text-2xl font-bold">
        {Page == "Device" ? t("DeviceRegistration") : t("TrackingRegistration")}
      </div>
      <div className="flex justify-center">
        <div className="flex-col items-center p-16">
          <div className="mb-8 text-slate-600 text-lg font-bold">
            {Page === "Device" ? t("DeviceQR") : t("TrackQR")}
          </div>
          <div className="relative flex items-center justify-center ">
            {!showQRReader && (
              <QRCode className="w-64" fgColor="#475569" value="Data" />
            )}
            {!showQRReader && (
              <Button
                variant="outline"
                className="absolute px-4 py-6 bg-white text-black text-lg rounded-xl border-2 border-black cursor-pointer"
                onClick={handleQRButtonClick}
              >
                {t("Scan")}
              </Button>
            )}

            <div className="flex-col items-center justify-center">
              {showQRReader && (
                <div className="mb-4 text-center">
                  <Button
                    className="px-6 py-2 bg-slate-600 text-white text-lg rounded-lg cursor-pointer"
                    onClick={handleStopButtonClick}
                  >
                    {t("Stop")}
                  </Button>
                </div>
              )}

              <video
                className="w-64  p-2 border-2 border-slate-600 rounded-md"
                ref={ref}
                style={{ display: showQRReader ? "" : "none" }}
              />
            </div>
          </div>
        </div>
        <div className=" relative h-96 border-r-2 border-black top-20"></div>

        <div className="flex-col items-center p-16">
          <div className="mb-8 text-slate-600 text-lg font-bold">
            {Page === "Device" ? t("DeviceInput") : t("TrackInput")}
          </div>
          <div className="flex flex-col items-center ">
            <Input
              type="text"
              value={trackId}
              onChange={(e) => {
                setData(e.target.value);
              }}
              placeholder={
                Page === "Device"
                  ? t("Deviceplaceholder")
                  : t("Trackplaceholder")
              }
              className="px-4 py-2 mb-4 border border-black rounded-md"
            />
            <Button
              className="mb- px-6 py-2 bg-slate-600 text-white text-lg rounded-3xl cursor-pointer"
              onClick={async () => {
                const params = new URLSearchParams();
                if (data !== "No Result") {
                  if (Page === "Device") {
                    if (data.length === 17) {
                      if (data) params.append("device_id", data);
                      const query = params.size ? "?" + params.toString() : "";
                      router.push("Device_registration/form" + query);
                    } else {
                      toast.error("Not a valid Track ID");
                    }
                  } else {
                    if (data.length >= 19) {
                      try {
                        if (data) params.append("track_id", data);

                        const query = params.size
                          ? "?" + params.toString()
                          : "";
                        const access_token =
                          localStorage.getItem("access_token");
                        const deviceidres = await axios.post(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showDeviceDetailsByDevicetag`,
                          { device_tag: data },
                          {
                            headers: {
                              Authorization: `Bearer ${access_token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        // console.log(deviceid.current);
                        const processingres = await axios.post(
                          `${process.env.NEXT_PUBLIC_BASE_URL}/devices/findCurrentProcessingTypeOfFollowingDevice`,
                          { device_id: deviceidres.data.body._id },
                          {
                            headers: {
                              Authorization: `Bearer ${access_token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        router.push("Tracking_registration/form" + query);
                      } catch (error: any) {
                        if (error.response && error.response.status === 409) {
                          toast.error("All Processing Types are full");
                        } else {
                          toast.error("Device not registered");
                        }
                      }
                    }
                  }
                }
              }}
            >
              {t("Submit")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodePage;
