"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MdDelete } from "react-icons/md";
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
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { TbDevicesPlus } from "react-icons/tb";

import { useTranslation } from "@/app/i18n/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaEdit, FaSearch } from "react-icons/fa";
import { MdShowChart } from "react-icons/md";
import { TfiAgenda } from "react-icons/tfi";
import { DataTablePagination } from "./DataTablePagination";
import { DeleteButton } from "./DeleteTrackingInfo";
import Progressbar from "../information_card/Progressbar";
import { toast } from "sonner";

export function TrackingCard() {
  const device_tags = React.useRef([]);
  const info: any = React.useRef(null);
  const pathname = usePathname();
  const lng = pathname.split("/")[1];
  const searchparams = useSearchParams();
  const deviceId = searchparams.get("device_id");
  const { t } = useTranslation(lng, "DeviceTable");
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  type DeviceRegistration = {
    device_tag: string;
    Serial: string;
    Model: string;
    Type: string;
    Status: string;
    Manufacturer: string;
    Specification: string;
    CreatedAt?: string;
    completed: string;
    total: string;
    id: string;
  };

  const data: DeviceRegistration[] = device_tags.current;

  const Columns: ColumnDef<DeviceRegistration>[] = [
    // Add columns as needed
    {
      accessorKey: "id",
      header: t("ID"),
      cell: ({ row }) => <></>,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "completed",
      header: t("Completed"),
      cell: ({ row }) => <></>,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "total",
      header: t("Total"),
      cell: ({ row }) => <></>,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "device_tag",
      header: t("DeviceID"),
      cell: ({ row }) => <div>{row.getValue("device_tag")}</div>,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "CreatedAt",
      header: t("CreatedAt"),
      cell: ({ row }) => {
        const isoTimestamp = row.getValue("CreatedAt") as string;
        const dateObject = new Date(isoTimestamp);
        const formattedDate = dateObject.toLocaleString();

        return <div>{formattedDate}</div>;
      },
      enableGlobalFilter: true,
    },

    {
      accessorKey: "Model",
      header: t("Model"),
      cell: ({ row }) => <div>{row.getValue("Model")}</div>,
      enableGlobalFilter: true,
    },
    {
      accessorKey: "Serial",
      header: t("Serial"),
      cell: ({ row }) => <div>{row.getValue("Serial")}</div>,
      enableGlobalFilter: true,
    },

    {
      accessorKey: "Progress",
      header: t("Progress"),
      cell: ({ row }) => (
        <div>
          <Progressbar
            completed={
              (parseFloat(row.getValue("completed")) /
                parseFloat(row.getValue("total"))) *
              100
            }
          />
        </div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "Status",
      header: t("Status"),
      cell: ({ row }) => (
        // <Badge
        //   variant="outline"
        //   className="bg-blue-900 text-white w-24 text-center flex items-center justify-center"
        // >
        //   {row.getValue("Status")}
        // </Badge>
        <div>{row.getValue("Status")}</div>
      ),
      enableGlobalFilter: true,
    },
    {
      accessorKey: "Action",
      header: t("Action"),
      cell: ({ row }) => (
        <div className="w-36">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  // variant="outline"
                  className="border-none text-xs w-36 bg-slate-600 mb-1"
                  onClick={async () => {
                    try {
                      const access_token = localStorage.getItem("access_token");
                      const processingres = await axios.post(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/findCurrentProcessingTypeOfFollowingDevice`,
                        { device_id: row.getValue("id") },
                        {
                          headers: {
                            Authorization: `Bearer ${access_token}`,
                            "Content-Type": "application/json",
                          },
                        }
                      );
                      console.log(processingres);
                      if (processingres.data.status === 200) {
                        const params = new URLSearchParams();
                        // params.append("track_tag", row.getValue("device_tag"));
                        params.append("track_id", row.getValue("device_tag"));
                        const query = params.size
                          ? "?" + params.toString()
                          : "";
                        router.push("Tracking_registration/form" + query);
                      }
                    } catch {
                      toast.error("All Processing Types are full");
                    }
                  }}
                >
                  {/* <MdShowChart className="bg-slate-700 text-white rounded" /> */}
                  Tracking Registration
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tracking Registration</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-none w-36 text-white bg-slate-600 text-xs"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.append("track_tag", row.getValue("device_tag"));
                    params.append("track_id", row.getValue("id"));
                    const query = params.size ? "?" + params.toString() : "";
                    router.push("Show_Tracking_Information" + query);
                  }}
                >
                  {/* <TfiAgenda /> */}
                  Tracking Information
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show Tracking Information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.append("track_id", row.getValue("device_tag"));
                    console.log(row);
                    const query = params.size ? "?" + params.toString() : "";
                    router.push("Tracking_registration/form" + query);
                  }}
                >
                  <FaEdit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}

          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="border-none">
                      <MdDelete />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          const access_token =
                            localStorage.getItem("access_token");
                          const deleting = await axios.post(
                            `${process.env.NEXT_PUBLIC_BASE_URL}/devices/deleteDeviceById`,
                            { device_id: row.getValue("id") },
                            {
                              headers: {
                                Authorization: `Bearer ${access_token}`,
                                "Content-Type": "application/json",
                              },
                            }
                          );

                          console.log("Deletion successful");
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        </div>
      ),
      enableGlobalFilter: true,
    },
  ];
  const table = useReactTable({
    data,
    columns: Columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // enableGlobalFilter: true,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [loading, setLoading] = React.useState(true);
  const fetchData = async () => {
    try {
      const access_token = localStorage.getItem("access_token");

      const tid = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/tracks/showTrackIdByTag`,
        { tag_number: deviceId },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const trackid = tid.data.body.track_id;
      const infos = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/devices/showAllActiveDevicesOfFollowingTrack`,
        { track_id: trackid },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      info.current = infos.data.body[0];
      device_tags.current = infos.data.body.map((device: any) => ({
        device_tag: device.device_tag,
        Name: device.device_model.name,
        Serial: device.serial,
        Model: device.device_model.model,
        Type: device.device_model.device_type,
        Manufacturer: device.device_model.manufacturer,
        Specification: device.device_model.spacifications,
        CreatedAt: device.createdAt,
        id: device._id,
        completed: device.record_summary.completed,
        total: device.record_summary.total,
        Status: device.status,
      }));
      console.log(device_tags.current);
      setLoading(false);
      // Your logic with the session data
    } catch (error) {
      console.error("Error fetching session data:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const idColumn = table.getColumn("id");
    if (idColumn) {
      idColumn.toggleVisibility(false);
    }
    const completedColumn = table.getColumn("completed");
    if (completedColumn) {
      completedColumn.toggleVisibility(false);
    }
    const totalColumn = table.getColumn("total");
    if (totalColumn) {
      totalColumn.toggleVisibility(false);
    }
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="relative w-96">
          <Input
            placeholder="Search... "
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="pl-4 pr-8 border-2"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
        </div>

        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => {
            router.push("/Device_registration");
          }}
        >
          <TbDevicesPlus className="mr-2 h-4 w-4" /> {t("CreateDevice")}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table className="border-black rounded-lg w-full">
          <TableHeader className="text-center bg-slate-600 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Columns.length}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
