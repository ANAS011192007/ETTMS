"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { MdDelete } from "react-icons/md";
// interface EditButtonProps {
//   id: string;
//   "Processing Type": string;
//   "Created at": string;
//   Location: string;
//   "Tool Used": string;
//   "Recorded By": string;
//   Image: string;
// }

export function DeleteButton({ trackingData }: { trackingData: string }) {
  const handleDelete = async () => {
    console.log(trackingData);
    try {
      const access_token = localStorage.getItem("access_token");
      const deleting = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/deleteDeviceById`,
        { device_id: trackingData },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Deletion successful");

      // Handle any additional logic after succWessful deletion, e.g., close the dialog
    } catch (error) {
      console.error("Error deleting tracking info:", error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-none">
          <MdDelete />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
