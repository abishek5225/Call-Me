'use client'
import { Message, User } from "@/types";
import { read } from "fs";
import { json } from "stream/consumers";
//safe storage wrapper
export const safeStorage = {

    async get(key: string): Promise<{value: string} | null> {
        if (typeof window === 'undefined') return null;

        if((window as any).storage?.get){
            return (window as any).storage.get(key);
        }

        const value = localStorage.getItem(key);
        return value ? {value} : null;
    },

   async set (key: string, value: string): Promise<void> {
    if(typeof window === 'undefined') return;

    if((window as any).storage?.set) {
        await (window as any).storage.set(key, value);
        return;
    }
    localStorage.setItem(key, value);
   }
}

export const StorageService = {
    //users
    async getAllUsers(): Promise<User[]> {
        try{
            const result = await safeStorage.get('all-users');
            return result ? JSON.parse(result.value) : [];
        }catch {
            return [];
        }
    },
    async saveUsers(users: User[]): Promise<void> {
        await safeStorage.set('all-users', JSON.stringify(users));
    },

    async getUserById(userId: string): Promise<User | null> {
        const users = await this.getAllUsers();
        return users.find(u => u.id === userId) || null;
    },

    //messages
    async getMessages(userId1: string, userId2: string): Promise<Message[]>{
        const key = [userId1, userId2].sort().join('-');

        try{
            const result = await safeStorage.get(`messages-${key}`);
            return result ? JSON.parse(result.value) : [];
        }catch{
            return [];
        }
    },

    async saveMessage(message: Message): Promise<void> {
        const key= [message.senderId, message.receiverId].sort().join('-')
        const messages = await this.getMessages(
            message.senderId,
            message.receiverId
        )

        messages.push(message);
        await safeStorage.set(`messeges-${key}`, JSON.stringify(messages));
    },


    async markMessageAsread(
        currentUserId: string,
        otherUserId: string
    ): Promise<void> {
        const messages = await this.getMessages(currentUserId, otherUserId);

        const updated = messages.map(m => m.receiverId === currentUserId ? {...m, read: true}: m);

        const key = [currentUserId, otherUserId].sort().join('-');
        await safeStorage.set(`messages-${key}`, JSON.stringify(updated))
    }
}