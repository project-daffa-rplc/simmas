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
  IconBuilding,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDatabaseOff,
  IconEdit,
  IconGripVertical,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTrash,
  IconTrendingUp,
  IconUser,
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
import { Spinner } from "@/components/ui/spinner";
import {
  berlangsung,
  dibatalkan,
  diterima,
  ditolak,
  pending,
  selesai,
} from "@/lib/api/helper";
import EditMagang from "../EditMagang";
import DeleteMagang from "../DeleteMagang";

export const schema = z.object({
  id: z.number(),
  nama_siswa: z.string(),
  nis: z.number(),
  kelas: z.string(),
  jurusan: z.string(),
  nama_guru: z.string(),
  nip: z.number(),
  nama_dudi: z.string(),
  alamat: z.string(),
  penanggung_jawab: z.string(),
  tanggal_mulai: z.string(),
  tanggal_selesai: z.string(),
  status: z.string(),
  nilai: z.string(),
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
    accessorKey: "siswa",
    header: "Siswa",

    cell: ({ row }) => (
      <div className="w-max flex flex-col gap-[5px]">
        <h1 className="text-[16px] font-semibold">{row.original.nama_siswa}</h1>
        <h1 className="text-[14px] font-normal">NIS: {row.original.nis}</h1>
        <h1 className="text-[14px] font-normal">{row.original.kelas}</h1>
        <h1 className="text-[14px] font-normal">{row.original.jurusan}</h1>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "guru_pembimbing",
    header: "Guru Pembimbing",
    cell: ({ row }) => (
      <div className="w-max h-full flex flex-col items-start justify-start gap-[5px]">
        {row.original.nama_guru ? (
          <>
            <h1 className="text-[16px] font-semibold">
              {row.original.nama_guru}
            </h1>
            <h1 className="text-[14px] font-normal">NIP: {row.original.nip}</h1>
          </>
        ) : (
          <h1 className="text-[16px] font-bold">-</h1>
        )}
      </div>
    ),
  },
  {
    accessorKey: "dudi",
    header: "Dudi",
    cell: ({ row }) => (
      <div className="w-max flex justify-center items-center gap-[10px]">
        {row.original.nama_dudi ? (
          <>
            {" "}
            <div className="p-[5px] bg-(--color-primary) text-(--color-background) rounded-[50px] ">
              <IconBuilding width={"15px"} height={"15px"} />
            </div>
            <div className="flex flex-col items-start">
              <h1 className="text-[16px] font-semibold">
                {row.original.nama_dudi}
              </h1>
              <h1 className="text-[14px] font-semibold">
                {row.original.alamat}
              </h1>
              <h1 className="text-[14px] font-normal">
                {row.original.penanggung_jawab}
              </h1>
            </div>
          </>
        ) : (
          <h1 className="text-[16px] font-semibold">-</h1>
        )}
      </div>
    ),
  },
  {
    accessorKey: "periode",
    header: "Periode",
    cell: ({ row }) => {
      if (
        row.original.status === berlangsung ||
        row.original.status === selesai
      ) {
        return (
          <div
            className={`w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-success-background)`}
          >
            <p className={`text-[14px] font-semibold text-(--color-success)`}>
              {row.original.status}
            </p>
          </div>
        );
      } else if (row.original.status === pending) {
        return (
          <div
            className={`w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-pendding-background)`}
          >
            <p className={`text-[14px] font-semibold text-(--color-pendding)`}>
              {row.original.status}
            </p>
          </div>
        );
      } else if (
        row.original.status === dibatalkan ||
        row.original.status === ditolak
      ) {
        return (
          <div
            className={`w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-error-background)`}
          >
            <p className={`text-[14px] font-semibold text-(--color-error)`}>
              {row.original.status}
            </p>
          </div>
        );
      } else if (row.original.status === diterima) {
        return (
          <div
            className={`w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-guru-background)`}
          >
            <p className={`text-[14px] font-semibold text-(--color-guru)`}>
              {row.original.status}
            </p>
          </div>
        );
      }
    },
  },
  {
    accessorKey: "nilai",
    header: () => <div className="w-full text-right">nilai</div>,
    cell: ({ row }) => (
      <div className="w-full flex justify-center items-center">
        <div
          className={`w-max h-max px-[8px] rounded-[8px] py-[5px] bg-(--color-success-background)`}
        >
          <p className={`text-[14px] font-semibold text-(--color-success)`}>
            {row.original.nilai ? row.original.nilai : 0}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: () => <div className="w-full text-center">Action</div>,
    cell: ({ row }) => {
      const [open, setOpen] = React.useState(false);

      return (
        <div className="w-full flex justify-center items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setOpen(!open)} variant={"none"}>
                <IconEdit />
              </Button>
            </DialogTrigger>
            <EditMagang  open={open} id={row.original.id} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"none"}>
                <IconTrash />
              </Button>
            </DialogTrigger>
            <DeleteMagang id={row.original.id} />
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

export function TableDudi({
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
                      <div className="w-full flex flex-col gap-[10px] justify-center items-center mt-[30px] mb-[30px]">
                        <IconDatabaseOff
                          width={"50px"}
                          height={"50px"}
                          className="text-(--color-primary)"
                        />
                        <p>Tidak Ada Data</p>
                      </div>
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
