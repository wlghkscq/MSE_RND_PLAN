"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AddPlanDialog({ onAdd }: { onAdd: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const { error } = await supabase.from("production_plan").insert([
            {
                p_no: data.p_no,
                supplier: data.supplier,
                delivery_date: data.delivery_date,
                manager: data.manager,
                order_quantity: parseInt(data.order_quantity as string) || 0,
                remarks: data.remarks,
                category: data.category,
                model_name: data.model_name,
                is_new: data.is_new,
                smd_t: data.smd_t,
                smd_t_date: data.smd_t_date || null,
                imd: data.imd,
                imd_data: data.imd_data || null,
                smd_b: data.smd_b,
                smd_b_date: data.smd_b_date || null,
                insertion_requester: data.insertion_requester,
                insertion_request_date: data.insertion_request_date || null,
                insertion_completer: data.insertion_completer,
                insertion_completion_date: data.insertion_completion_date || null,
            },
        ]);

        if (error) {
            alert("Error adding plan: " + error.message);
        } else {
            setOpen(false);
            onAdd();
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    신규 계획 추가
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">신규 생산 계획 추가</DialogTitle>
                        <DialogDescription>
                            상세 생산 계획 정보를 입력하세요.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="p_no">P/no</Label>
                            <Input id="p_no" name="p_no" required placeholder="예: RND.TARBP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supplier">공급처</Label>
                            <Input id="supplier" name="supplier" required placeholder="예: R개발팀1" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="delivery_date">납기</Label>
                            <Input id="delivery_date" name="delivery_date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manager">담당자</Label>
                            <Input id="manager" name="manager" required placeholder="예: 진윤상" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="order_quantity">주문수량</Label>
                            <Input id="order_quantity" name="order_quantity" type="number" placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">구분</Label>
                            <Input id="category" name="category" placeholder="예: 샘플" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="model_name">모델명</Label>
                            <Input id="model_name" name="model_name" placeholder="예: CST" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="is_new">신규 여부</Label>
                            <Input id="is_new" name="is_new" placeholder="기존 대비 변경 사항 등" />
                        </div>

                        <div className="col-span-2 border-t pt-2 mt-2 font-semibold text-sm text-slate-500">공정별 상세 정보</div>

                        <div className="space-y-2">
                            <Label htmlFor="smd_t">SMD_T 담당</Label>
                            <Input id="smd_t" name="smd_t" placeholder="이름" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smd_t_date">SMD_T 날짜</Label>
                            <Input id="smd_t_date" name="smd_t_date" type="date" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imd">IMD 담당</Label>
                            <Input id="imd" name="imd" placeholder="이름" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="imd_data">IMD 날짜</Label>
                            <Input id="imd_data" name="imd_data" type="date" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="smd_b">SMD_B 담당</Label>
                            <Input id="smd_b" name="smd_b" placeholder="이름" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="smd_b_date">SMD_B 날짜</Label>
                            <Input id="smd_b_date" name="smd_b_date" type="date" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="insertion_requester">자삽 제원 요청자</Label>
                            <Input id="insertion_requester" name="insertion_requester" placeholder="이름" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="insertion_request_date">자삽 제원 요청일</Label>
                            <Input id="insertion_request_date" name="insertion_request_date" type="date" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="insertion_completer">자삽 제원 완료자</Label>
                            <Input id="insertion_completer" name="insertion_completer" placeholder="이름" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="insertion_completion_date">자삽 제원 완료일</Label>
                            <Input id="insertion_completion_date" name="insertion_completion_date" type="date" />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="remarks">비고</Label>
                            <Input id="remarks" name="remarks" placeholder="추가 설명" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>취소</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "추가 중..." : "계획 추가"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
