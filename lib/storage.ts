'use client';

import { User } from '@/types';
import { Message } from '@/types';
import { Conversation } from '@/types';

const safeStorage = {
  async get(key: string): Promise<{ value: string } | null> {
    if (typeof window === 'undefined') return null;

    // custom storage 
    if ((window as any).storage?.get) {
      return (window as any).storage.get(key);
    }

    const value = localStorage.getItem(key);
    return value ? { value } : null;
  },

  async set(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined') return;

    if ((window as any).storage?.set) {
      await (window as any).storage.set(key, value);
      return;
    }

    localStorage.setItem(key, value);
  },
};


export const StorageService = {

  async getAllUsers(): Promise<User[]> {
    try {
      const result = await safeStorage.get('all-users');
      return result ? JSON.parse(result.value) : [];
    } catch {
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


  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const key = [userId1, userId2].sort().join('-');

    try {
      const result = await safeStorage.get(`messages-${key}`);
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },

  async saveMessage(message: Message): Promise<void> {
    const key = [message.senderId, message.receiverId].sort().join('-');
    const messages = await this.getMessages(
      message.senderId,
      message.receiverId
    );

    messages.push(message);
    await safeStorage.set(`messages-${key}`, JSON.stringify(messages));
  },

  async markMessagesAsRead(
    currentUserId: string,
    otherUserId: string
  ): Promise<void> {
    const messages = await this.getMessages(currentUserId, otherUserId);

    const updated = messages.map(m =>
      m.receiverId === currentUserId ? { ...m, read: true } : m
    );

    const key = [currentUserId, otherUserId].sort().join('-');
    await safeStorage.set(`messages-${key}`, JSON.stringify(updated));
  },


  async getConversations(userId: string): Promise<Conversation[]> {
    const users = await this.getAllUsers();
    const conversations: Conversation[] = [];

    for (const user of users) {
      if (user.id === userId) continue;

      const messages = await this.getMessages(userId, user.id);

      const unreadCount = messages.filter(
        m => m.receiverId === userId && !m.read
      ).length;

      conversations.push({
        userId: user.id,
        lastMessage: messages[messages.length - 1],
        unreadCount,
      });
    }

    return conversations.sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || '0';
      const timeB = b.lastMessage?.timestamp || '0';
      return timeB.localeCompare(timeA);
    });
  },
};
