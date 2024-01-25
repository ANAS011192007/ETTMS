"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Trans } from "react-i18next/TransWithoutContext";
import { MdRefresh } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useTranslation } from "../../i18n/client";
import users from "@/data/db.json";
import { useEffect, useRef } from "react";
const NavbarPage = () => {
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const { t } = useTranslation(lng, "navbar");

  const router = useRouter();
  let accessToken, user;
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
  const handleLanguageChange = (selectedLanguage: string) => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;

      // Replace /en/ with /ja/ or vice versa
      const updatedPathname = currentUrl.replace(
        /\/(en|ja)\//,
        `/${selectedLanguage}/`
      );

      router.push(updatedPathname);
    }
  };

  const getUserDetails = () => {
    return localStorage.getItem("user_info");
  };

  // Call the function to get user details
  const userDetails = getUserDetails();
  // if (typeof localStorage !== "undefined") {
  //   user = localStorage.getItem("user_info");
  // }
  return (
    <nav className="p-2 flex items-center justify-end border-b">
      <div className="flex items-center justify-center">
        <Link href="" className="mr-4">
          <MdRefresh className="text-xl text-slate-500" />
        </Link>
      </div>

      <div className="flex-col mr-4 border-r pr-4">
        <div className="text-slate-500 text-xs">{t("Language-change")}</div>
        <div className="border-b-2">
          <Trans i18nKey="languageSwitcher" t={t}>
            <Select onValueChange={(value) => handleLanguageChange(value)}>
              <SelectTrigger className="border-none">
                <SelectValue
                  placeholder={lng === "ja" ? "日本語" : "English"}
                  className=""
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Language")}</SelectLabel>
                  <SelectItem value="en">{t("English")}</SelectItem>
                  <SelectItem value="ja">{t("Japanese")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Trans>
        </div>
      </div>

      <div className="flex items-center justify-center mr-2 ">
        <DropdownMenu>
          <div className="flex items-center">
            <Avatar>
              <AvatarImage
                className="cursor-pointer"
                src="https://github.com/shadcn.png"
                alt="user"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>{t("user")}</AvatarFallback>
            </Avatar>
            <div className="flex-col ml-2">
              <div className="text-blue-900 font-bold">
                {/* {userDetails
                  ? `${userDetails.firstName} ${userDetails.lastName}` */}
                {/* {user} */}
                {/* hello */}
                {userDetails}
              </div>
              <div className="text-slate-500 text-xs">Ultra-X Asia Pacific</div>
            </div>
          </div>
          <DropdownMenuTrigger>
            <RiArrowDropDownLine className="text-4xl text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link href="Logout">{t("Logout")}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavbarPage;
