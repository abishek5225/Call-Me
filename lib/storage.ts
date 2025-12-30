'use client'
import { User } from "@/types";

export const StorageService = {

    async get(key: string): Promise<{value: string} | null> {
        if (typeof window === 'undefined') return null;

        if((window as any).storage?.get){
            return (window as any).storage.get(key);
        }

        const value = localStorage.getItem(key);
        return value ? {value} : null;
    }
}