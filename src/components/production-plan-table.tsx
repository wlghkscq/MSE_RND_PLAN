"use client";

import React, { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductionPlan } from "@/types/production-plan";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { ScheduleDialog } from "@/components/schedule-dialog";

interface ProductionPlanTableProps {
    data: ProductionPlan[];
    onRefresh: () => void;
}

export function ProductionPlanTable({ data, onRefresh }: ProductionPlanTableProps) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
    const [activeMode, setActiveMode] = useState<"SMD_T" | "IMD" | "SMD_B" | "INSERTION_REQUEST" | "INSERTION_COMPLETION">("SMD_T");

    const formatCombined = (name?: string, dateStr?: string) => {
        if (!name && !dateStr) return null;
        let formattedDate = "";
        if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                formattedDate = ` (${date.getMonth() + 1}/${date.getDate()})`;
            } else {
                formattedDate = ` (${dateStr})`;
            }
        }
        return `${name || ""}${formattedDate}`;
    };

    const handleCellClick = (plan: ProductionPlan, mode: typeof activeMode) => {
        setSelectedPlan(plan);
        setActiveMode(mode);
        setScheduleDialogOpen(true);
    };

    const columns: ColumnDef<ProductionPlan>[] = [
        {
            accessorKey: "p_no",
            header: "P/no",
            cell: ({ row }) => (
                <div className="bg-amber-400 font-bold px-2 py-1 rounded text-xs text-center">
                    {row.original.p_no}
                </div>
            ),
        },
        { accessorKey: "supplier", header: "공급처" },
        { accessorKey: "delivery_date", header: "납기" },
        {
            accessorKey: "order_quantity",
            header: "주문수량",
            cell: ({ row }) => <div className="text-center">{row.original.order_quantity}</div>,
        },
        {
            accessorKey: "remarks",
            header: "비고",
            cell: ({ row }) => <div className="text-[10px] leading-tight max-w-[200px] truncate">{row.original.remarks}</div>,
        },
        { accessorKey: "category", header: "구분" },
        { accessorKey: "model_name", header: "모델명" },
        {
            id: "smd_t_combined",
            header: "SMD_T",
            cell: ({ row }) => {
                const val = formatCombined(row.original.smd_t, row.original.smd_t_date);
                if (!val) {
                    return (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full"
                            onClick={() => handleCellClick(row.original, "SMD_T")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors"
                        onClick={() => handleCellClick(row.original, "SMD_T")}
                    >
                        {val}
                    </div>
                );
            },
        },
        {
            id: "imd_combined",
            header: "IMD",
            cell: ({ row }) => {
                const val = formatCombined(row.original.imd, row.original.imd_data);
                if (!val) {
                    return (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full"
                            onClick={() => handleCellClick(row.original, "IMD")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors"
                        onClick={() => handleCellClick(row.original, "IMD")}
                    >
                        {val}
                    </div>
                );
            },
        },
        {
            id: "smd_b_combined",
            header: "SMD_B",
            cell: ({ row }) => {
                const val = formatCombined(row.original.smd_b, row.original.smd_b_date);
                if (!val) {
                    return (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full"
                            onClick={() => handleCellClick(row.original, "SMD_B")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors"
                        onClick={() => handleCellClick(row.original, "SMD_B")}
                    >
                        {val}
                    </div>
                );
            },
        },
        {
            id: "insertion_request_combined",
            header: "자삽 제원 요청일",
            cell: ({ row }) => {
                const val = formatCombined(row.original.insertion_requester, row.original.insertion_request_date);
                if (!val) {
                    return (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full"
                            onClick={() => handleCellClick(row.original, "INSERTION_REQUEST")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors"
                        onClick={() => handleCellClick(row.original, "INSERTION_REQUEST")}
                    >
                        {val}
                    </div>
                );
            },
        },
        {
            id: "insertion_completion_combined",
            header: "자삽 제원 완료일",
            cell: ({ row }) => {
                const val = formatCombined(row.original.insertion_completer, row.original.insertion_completion_date);
                if (!val) {
                    return (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full"
                            onClick={() => handleCellClick(row.original, "INSERTION_COMPLETION")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="px-2 py-1 text-xs text-center cursor-pointer hover:bg-slate-100 rounded transition-colors"
                        onClick={() => handleCellClick(row.original, "INSERTION_COMPLETION")}
                    >
                        {val}
                    </div>
                );
            },
        },
        {
            accessorKey: "is_new",
            header: "신규 여부",
            cell: ({ row }) => <div className="text-[10px] leading-tight">{row.original.is_new}</div>,
        },
        {
            accessorKey: "manager",
            header: "담당자",
            cell: ({ row }) => {
                const isDuplicate = row.original.duplicate_status === "있음";
                return (
                    <div className={cn("bg-amber-400 font-bold px-2 py-1 rounded text-xs text-center", isDuplicate && "bg-red-500 text-white")}>
                        {row.original.manager}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: { columnFilters },
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 bg-slate-100 p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">필터:</span>
                </div>
                <Input
                    placeholder="P/no 필터..."
                    value={(table.getColumn("p_no")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("p_no")?.setFilterValue(event.target.value)}
                    className="max-w-[150px] h-8 text-xs bg-white"
                />
                <Input
                    placeholder="담당자 필터..."
                    value={(table.getColumn("manager")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("manager")?.setFilterValue(event.target.value)}
                    className="max-w-[150px] h-8 text-xs bg-white"
                />
                <Input
                    placeholder="공급처 필터..."
                    value={(table.getColumn("supplier")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("supplier")?.setFilterValue(event.target.value)}
                    className="max-w-[150px] h-8 text-xs bg-white"
                />
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table className="border-collapse text-[11px]">
                    <TableHeader className="bg-slate-50 border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="h-10 px-2 py-1 font-bold text-slate-800 border-x text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-1">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                            <Filter className="w-3 h-3 text-slate-400" />
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className={cn(
                                        "hover:bg-slate-50/50 h-10 border-b",
                                        row.original.duplicate_status === "있음" && "bg-red-50 hover:bg-red-100"
                                    )}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-1 border-x whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    데이터가 없습니다.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ScheduleDialog
                open={scheduleDialogOpen}
                onOpenChange={setScheduleDialogOpen}
                onSuccess={onRefresh}
                plan={selectedPlan}
                mode={activeMode}
            />
        </div>
    );
}
