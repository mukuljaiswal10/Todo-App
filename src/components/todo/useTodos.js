"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useTodos(params) {
    return useQuery({
        queryKey: ["todos", params],
        queryFn: async () => {
            const res = await api.get("/api/todos", { params });
            return res.data;
        },
    });
}

export function useCreateTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload) => {
            const res = await api.post("/api/todos", payload);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
    });
}

export function useUpdateTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, patch }) => {
            const res = await api.patch(`/api/todos/${id}`, patch);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
    });
}

export function useDeleteTodo() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await api.delete(`/api/todos/${id}`);
            return res.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["todos"] }),
    });
}