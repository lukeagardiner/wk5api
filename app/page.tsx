'use client';

import { useEffect, useState } from 'react';
import { User } from './types/user';

export default function OnlineStatusManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserId, setNewUserId] = useState('');

  // Fetch all users and update the state
  const fetchAll = async () => {
    try {
      const res = await fetch(`/api/users/`)
      if (res.ok) {
        const data = await res.json();

        // Assuming the data is an array of users
        const users: User[] = data.map((user: { id: number; name: string; onlineStatus: 'online' | 'offline' }) => ({
          id: user.id,
          name: user.name,
          onlineStatus: user.onlineStatus,
        }));

        setUsers(users); // Update te state with fetched users
      } else {
        console.log("Error Data Empty: no data");
      }
    } catch (error) {
      console.log("Error Data Empty: no data", error);
    }
  };

  // Load initial status for each user when the component mounts
  useEffect(() => {
    fetchAll();
  }, []);

  // Toggle online/offline status
  const toggleStatus = async (id: number) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;

    const newStatus = current.onlineStatus === 'online' ? 'offline' : 'online'; // Store toggle lineStatus
    const newName = current.name;

    const res = await fetch(`/api/users?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type' : 'application/json'},
      body: JSON.stringify({ name: newName, lineStatus: newStatus }), //Corrected field names
    });

    if (res.ok) {
      setUsers((prev) => 
        prev.map((u) => (u.id === id ? {...u, lineStatus: newStatus} :u))
      );
    }
  };

  // Add a new user ID and fetch their status
  const addUser = async () => {
    if (!newUserId) return; // Don't add empty IDs

    // POST request to add the user (assuming a simple post to add new user)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newUserId, onlineStatus: 'offline' }),
    });

    if (res.ok) {
      // Clear the input fiel after adding
      setNewUserId('');
    }
  }


}