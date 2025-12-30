export interface User{
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string;
    status: 'online' | 'offline' |'busy';
    createdAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface Conversation {
    userId: string;
    lastMessage?: Message;
    unreadCount: number;
}

export interface Call {
    id: string;
    participants: User[];
    type: 'video' | 'audio';
    status: 'connecting' | 'active' | 'ended';
    startedAt: string;
}