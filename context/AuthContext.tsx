import { User } from "@/types";
import { createContext } from "react";

interface AuthContextType {
    user: User | null;
    users: User[];
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    getOnlineUsers: () => User[];
    updateUserStatus : (status: 'online' | 'offline' | 'busy') => Promise<void>
    refreshUsers: ()=> Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null);