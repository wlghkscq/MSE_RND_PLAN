"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { ProductionPlan, UserMaster } from "@/types/production-plan";
import { Trash2 } from "lucide-react";

interface ScheduleDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    plan: ProductionPlan | null;
    mode: "SMD_T" | "IMD" | "SMD_B" | "INSERTION_REQUEST" | "INSERTION_COMPLETION";
}

const MODE_CONFIG = {
    SMD_T: { title: "SMD_T 일정 등록", nameKey: "smd_t", dateKey: "smd_t_date", label: "SMD_T 담당" },
    IMD: { title: "IMD 일정 등록", nameKey: "imd", dateKey: "imd_data", label: "IMD 담당" },
    SMD_B: { title: "SMD_B 일정 등록", nameKey: "smd_b", dateKey: "smd_b_date", label: "SMD_B 담당" },
    INSERTION_REQUEST: { title: "자삽 제원 요청 일정 등록", nameKey: "insertion_requester", dateKey: "insertion_request_date", label: "자삽 제원 요청자" },
    INSERTION_COMPLETION: { title: "자삽 제원 완료 일정 등록", nameKey: "insertion_completer", dateKey: "insertion_completion_date", label: "자삽 제원 완료자" },
};

export function ScheduleDialog({ open, onOpenChange, onSuccess, plan, mode }: ScheduleDialogProps) {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<UserMaster[]>([]);
    const config = MODE_CONFIG[mode];

    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await supabase.from("user_master").select("*").order("name");
            if (data) setUsers(data);
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (plan) {
            setName((plan as any)[config.nameKey] || "");
            setDate((plan as any)[config.dateKey] || "");
        } else {
            setName("");
            setDate("");
        }
    }, [plan, mode, open]);

    const handleSave = async () => {
        if (!plan) return;
        setLoading(true);

        const updateData = {
            [config.nameKey]: name,
            [config.dateKey]: date || null,
        };

        const { error } = await supabase
            .from("production_plan")
            .update(updateData)
            .eq("id", plan.id);

        if (error) {
            alert("추가 중 오류 발생: " + error.message);
        } else {
            onOpenChange(false);
            onSuccess();
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!plan || !confirm("정말 이 일정을 삭제하시겠습니까?")) return;
        setLoading(true);

        const updateData = {
            [config.nameKey]: null,
            [config.dateKey]: null,
        };

        const { error } = await supabase
            .from("production_plan")
            .update(updateData)
            .eq("id", plan.id);

        if (error) {
            alert("삭제 중 오류 발생: " + error.message);
        } else {
            onOpenChange(false);
            onSuccess();
        }
        setLoading(false);
    };

    const isEdit = plan && (plan as any)[config.nameKey];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{config.title}</DialogTitle>
                    <DialogDescription>공정별 상세 정보를 입력하거나 수정하세요.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-6 py-6 border-y my-2">
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">{config.label}</Label>
                        <Select value={name} onValueChange={setName}>
                            <SelectTrigger>
                                <SelectValue placeholder="이름 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={user.name}>
                                        {user.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold">{mode.includes("DATE") || config.dateKey.includes("date") || config.dateKey === "imd_data" ? "날짜" : "날짜"}</Label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter className="flex justify-between items-center sm:justify-between w-full">
                    <div>
                        {isEdit && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={handleDelete}
                                disabled={loading}
                                className="gap-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                삭제
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            취소
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={loading || !name}
                            className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                        >
                            {loading ? "저장 중..." : isEdit ? "수정" : "일정 등록"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
