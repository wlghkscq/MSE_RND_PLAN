export interface ProductionPlan {
    id: number;
    order_date?: string;
    p_no: string;
    supplier: string;
    delivery_date: string;
    order_quantity?: number;
    remarks?: string;
    category?: string;
    model_name?: string;
    smd_t?: string;
    smd_t_date?: string;
    imd?: string;
    imd_data?: string;
    smd_b?: string;
    smd_b_date?: string;
    insertion_request_date?: string;
    insertion_completion_date?: string;
    insertion_requester?: string;
    insertion_completer?: string;
    is_new?: string;
    manager?: string;
    process_code?: string;
    duplicate_status?: '있음' | '없음';
    created_at?: string;
}

export interface UserMaster {
    id: number;
    name: string;
    department?: string;
    job_rank?: string;
}

export interface RankMaster {
    id: number;
    rank_name: string;
    // Other fields if any
}
