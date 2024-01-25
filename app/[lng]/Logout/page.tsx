"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import NavbarPage from "../navbar/page";
import SidebarPage from "../sidebar/page";

const SettingPage = () => {
  const router = useRouter();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear localStorage
    localStorage.clear();

    // Redirect to the login page
    router.push("/Login");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex">
        <SidebarPage />
        <div className="flex-1 ">
          <NavbarPage />
          <div className="flex items-center justify-center h-[89.8%] bg-gray-200">
            <Card className="bg-white p-4 rounded-xl">
              <div className="container">
                <div>
                  <h1 className="text-center text-2xl mb-4">Signout</h1>
                  <form onSubmit={handleSignOut}>
                    <p className="text-center mb-4">
                      Are you sure you want to sign out?
                    </p>
                    <Button type="submit" className="w-full">
                      Sign Out
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
