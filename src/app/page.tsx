"use client";

import React, { useEffect, useState } from "react";
import { ProductionPlanTable } from "@/components/production-plan-table";
import { AddPlanDialog } from "@/components/add-plan-dialog";
import { supabase } from "@/lib/supabase";
import { ProductionPlan } from "@/types/production-plan";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [data, setData] = useState<ProductionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // 실제 운영 시 v_production_plan_status 뷰에서 데이터를 가져오는 것이 좋습니다.
    const { data: plans, error } = await supabase
      .from("production_plan")
      .select("*")
      .order("delivery_date", { ascending: true });

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setData(plans || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">생산계획 일정표</h1>
            <p className="text-slate-500 mt-1">실시간 생산 계획 및 중복 상태를 관리합니다.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={fetchData} title="새로고침">
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </Button>
            <AddPlanDialog onAdd={fetchData} />
          </div>
        </header>

        <section className="bg-white rounded-xl shadow-sm border p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-slate-500 font-medium">데이터를 불러오는 중입니다...</p>
            </div>
          ) : (
            <ProductionPlanTable data={data} onRefresh={fetchData} />
          )}
        </section>
      </div>
    </main>
  );
}
