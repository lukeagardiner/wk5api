//app/types/user.tsx
export interface User {
    id: number;
    name: string;
    onlineStatus: 'online' | 'offline';
}