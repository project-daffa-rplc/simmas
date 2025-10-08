import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconGripVertical,
  IconMail,
  IconMapPin,
  IconPhone,
  IconShield,
  IconTrash,
  IconTrendingUp,
  IconUser,
  IconUserCheck,
  IconUserX,
} from "@tabler/icons-react";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import type { ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import EditUser from "../EditUser";
import DeleteUser from "../DeleteUser";
// import EditDudi from "../EditDudi";
// import DeleteDudi from "../DeleteDudi";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  role_id: z.number(),
  email_verified_at: z.string(),
  email: z.string(),
  created_at: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "User",

    cell: ({ row }) => (
      <div className="w-full flex items-center gap-[8px]">
        <div className="w-max h-max flex justify-center items-center rounded-[50px] p-[8px] bg-(--color-primary)">
          <IconUser
            width={"15px"}
            height={"15px"}
            className="text-(--color-background)"
          />
        </div>
        <div className="flex flex-col w-max items-start justify-center gap-[5px]">
          <h1 className="text-[14px] font-semibold">{row.original.name}</h1>
          <p className="text-[14px]">ID : {row.original.id}</p>
        </div>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "email_verified_at",
    header: "Email & Verifikasi",
    cell: ({ row }) => (
      <div className="w-full flex flex-col gap-[10px]">
        <div className="flex w-max items-center justify-center gap-[5px]">
          <IconMail width={"15px"} height={"15px"} />
          <h1 className="text-[14px] font-normal">{row.original.email}</h1>
        </div>
        {row.original.email_verified_at ? (
          <div
            className={`flex w-max items-center justify-center gap-[5px] px-[8px] py-[5px] rounded-[20px] ${
              row.original.email_verified_at
                ? "bg-(--color-success-background) text-(--color-success)"
                : "bg-(--color-error-background) text-(--color-error)"
            } `}
          >
            <IconUserCheck width={"15px"} height={"15px"} />
            <h1 className="text-[12px] font-normal">
              {row.original.email_verified_at ? "verified" : "novrified"}
            </h1>
          </div>
        ) : (
          <div
            className={`flex w-max items-center justify-center gap-[px] px-[8px] py-[5px] rounded-[20px] ${
              row.original.email_verified_at
                ? "bg-(--color-success-background) text-(--color-success)"
                : "bg-(--color-error-background) text-(--color-error)"
            } `}
          >
            <IconUserX width={"15px"} height={"15px"} />
            <h1 className="text-[12px] font-normal">
              {row.original.email_verified_at ? "verified" : "novrified"}
            </h1>
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: () => <div className="w-full text-center">Role</div>,
    cell: ({ row }) => {
      if (row.original.role_id === 1) {
        return (
          <div className="w-full flex justify-center items-center gap-[5px]">
            <div className="flex justify-center items-center px-[10px] py-[5px] gap-[5px] bg-(--color-admin-background) text-(--color-admin) rounded-[20px]">
              <IconShield width={"15px"} height={"15px"} />
              <h1 className="text-[12px] font-normal">Admin</h1>
            </div>
          </div>
        );
      } else if (row.original.role_id === 2) {
        return (
          <div className="w-full flex justify-center items-center gap-[5px]">
            <div className="flex justify-center items-center px-[10px] py-[5px] gap-[5px] bg-(--color-guru-background) text-(--color-guru) rounded-[20px]">
              <IconShield width={"15px"} height={"15px"} />
              <h1 className="text-[12px] font-normal">Guru</h1>
            </div>
          </div>
        );
      } else if (row.original.role_id === 3) {
        return (
          <div className="w-full flex justify-center items-center gap-[5px]">
            <div className="flex justify-center items-center px-[10px] py-[5px] gap-[5px] bg-(--color-siswa-background) text-(--color-siswa) rounded-[20px]">
              <IconShield width={"15px"} height={"15px"} />
              <h1 className="text-[12px] font-normal">Siswa</h1>
            </div>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "terdaftar",
    header: () => <div className="w-full text-center">Terdaftar</div>,
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <p className="text-[14px]">
          {" "}
          {new Date(row.original.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="w-[80px] text-right">Action</div>,
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false)
      return (
        <div className="w-full flex justify-center items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(!open)} variant={"none"}>
                <IconEdit />
              </Button>
            </DialogTrigger>
            <EditUser open={open}  id={row.original.id} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"none"}>
                <IconTrash />
              </Button>
            </DialogTrigger>
            <DeleteUser id={row.original.id} />
          </Dialog>
        </div>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function TableManagement({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className=" sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
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
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-end px-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;
