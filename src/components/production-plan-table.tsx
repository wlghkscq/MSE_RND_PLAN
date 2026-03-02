"use client";

import React, { useState, useMemo } from "react";
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
import { ProductionPlan, UserMaster, RankMaster } from "@/types/production-plan";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { ScheduleDialog } from "@/components/schedule-dialog";

interface ProductionPlanTableProps {
    data: ProductionPlan[];
    users: UserMaster[];
    ranks: RankMaster[];
    onRefresh: () => void;
}

export function ProductionPlanTable({ data, users, ranks, onRefresh }: ProductionPlanTableProps) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<ProductionPlan | null>(null);
    const [activeMode, setActiveMode] = useState<"SMD_T" | "IMD" | "SMD_B" | "INSERTION_REQUEST" | "INSERTION_COMPLETION">("SMD_T");

    // Create a map for quick name -> rank lookup
    const userRankMap = useMemo(() => {
        const map = new Map<string, string>();
        users.forEach(user => {
            if (user.name) {
                // Find the rank name that matches user.job_rank
                const rank = ranks.find(r => String(r.id) === String(user.job_rank) || r.rank_name === user.job_rank);
                map.set(user.name, rank ? rank.rank_name : "");
            }
        });
        return map;
    }, [users, ranks]);

    const getRankedName = (name?: string) => {
        if (!name) return "";
        const rank = userRankMap.get(name);
        return rank ? `${name} ${rank}` : name;
    };

    const formatCombined = (name?: string, dateStr?: string) => {
        if (!name && !dateStr) return null;
        const rankedName = getRankedName(name);
        let formattedDate = "";
        if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
                formattedDate = ` (${date.getMonth() + 1}/${date.getDate()})`;
            } else {
                formattedDate = ` (${dateStr})`;
            }
        }
        return `${rankedName}${formattedDate}`;
    };

    const formatDateShort = (dateStr?: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${month}-${day}`;
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
                <div className="bg-amber-400 font-bold px-2 py-1 rounded text-[10px] text-center w-[90px]">
                    {row.original.p_no}
                </div>
            ),
        },
        {
            accessorKey: "supplier",
            header: "공급처",
            cell: ({ row }) => <div className="w-[70px] text-center truncate">{row.original.supplier}</div>
        },
        {
            accessorKey: "delivery_date",
            header: "납기",
            cell: ({ row }) => <div className="w-[50px] text-center font-medium">{formatDateShort(row.original.delivery_date)}</div>
        },
        {
            accessorKey: "order_quantity",
            header: "주문수량",
            cell: ({ row }) => <div className="text-center w-[40px]">{row.original.order_quantity}</div>,
        },
        {
            accessorKey: "remarks",
            header: "비고",
            cell: ({ row }) => (
                <div className="text-[10px] leading-tight w-[180px] truncate" title={row.original.remarks}>
                    {row.original.remarks}
                </div>
            ),
        },
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
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full min-w-[80px]"
                            onClick={() => handleCellClick(row.original, "SMD_T")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors min-w-[80px]"
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
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full min-w-[80px]"
                            onClick={() => handleCellClick(row.original, "IMD")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors min-w-[80px]"
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
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full min-w-[80px]"
                            onClick={() => handleCellClick(row.original, "SMD_B")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors min-w-[80px]"
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
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full min-w-[100px]"
                            onClick={() => handleCellClick(row.original, "INSERTION_REQUEST")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="bg-green-600 text-white font-medium px-2 py-1 rounded text-xs text-center cursor-pointer hover:bg-green-700 transition-colors min-w-[100px]"
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
                            className="h-7 text-[10px] px-2 bg-blue-600 hover:bg-blue-700 w-full min-w-[100px]"
                            onClick={() => handleCellClick(row.original, "INSERTION_COMPLETION")}
                        >
                            일정등록
                        </Button>
                    );
                }
                return (
                    <div
                        className="px-2 py-1 text-xs text-center cursor-pointer hover:bg-slate-100 rounded transition-colors min-w-[100px]"
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
            cell: ({ row }) => (
                <div className="text-[10px] leading-tight w-[120px] truncate" title={row.original.is_new}>
                    {row.original.is_new}
                </div>
            ),
        },
        {
            accessorKey: "manager",
            header: "담당자",
            cell: ({ row }) => {
                const isDuplicate = row.original.duplicate_status === "있음";
                const rankedName = getRankedName(row.original.manager);
                return (
                    <div className={cn("bg-amber-400 font-bold px-2 py-1 rounded text-xs text-center min-w-[80px]", isDuplicate && "bg-red-500 text-white")}>
                        {rankedName}
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

    const getStickyClass = (columnId: string, isDuplicate: boolean) => {
        const bgClass = isDuplicate ? "bg-red-50" : "bg-white";
        const baseClass = `sticky z-20 ${bgClass} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]`;

        if (columnId === "delivery_date") return cn(baseClass, "left-0 border-l-2");
        if (columnId === "order_quantity") return cn(baseClass, "left-[60px]");
        if (columnId === "remarks") return cn(baseClass, "left-[110px]");
        return "";
    };

    const getHeaderStickyClass = (columnId: string) => {
        const baseClass = "sticky z-30 bg-slate-50 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]";
        if (columnId === "delivery_date") return cn(baseClass, "left-0 border-l-2");
        if (columnId === "order_quantity") return cn(baseClass, "left-[60px]");
        if (columnId === "remarks") return cn(baseClass, "left-[110px]");
        return "";
    };

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
            <div className="rounded-md border overflow-x-auto relative shadow-sm max-h-[70vh]">
                <Table className="border-collapse text-[11px] w-full min-w-[1200px]">
                    <TableHeader className="bg-slate-50 border-b sticky top-0 z-40">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={cn(
                                            "h-10 px-2 py-1 font-bold text-slate-800 border-x text-center whitespace-nowrap",
                                            getHeaderStickyClass(header.column.id)
                                        )}
                                    >
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
                            table.getRowModel().rows.map((row) => {
                                const isDuplicate = row.original.duplicate_status === "있음";
                                return (
                                    <TableRow
                                        key={row.id}
                                        className={cn(
                                            "hover:bg-slate-50/50 h-10 border-b relative group",
                                            isDuplicate && "bg-red-50 hover:bg-red-100"
                                        )}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    "p-1 border-x whitespace-nowrap",
                                                    getStickyClass(cell.column.id, isDuplicate)
                                                )}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
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
