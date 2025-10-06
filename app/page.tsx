'use client';

import { useEffect, useState } from 'react';
import { User } from './types/user';
import { spawn } from 'child_process';

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

      // Directly update the UI by adding the new user to the state
      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
    } else {
      console.log('Failed to add user');
    }
  };

  const deleteId = async (id: number) => {
    // DELETE request to remove the user (assuming a simple post to remove user)
    const res = await fetch(`/api/users?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id}),
    });

    if (res.ok) {
      fetchAll();
    } else {
      console.log('Error: Delete action failed');
    }
  };

  // *** DEFINE PRESENTATION ***
  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Presence (Online/Offline)</h2>

      {/* Input to add a new user ID*/}
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="test"
          value={newUserId}
          onChenge={(e) => setNewUserId(e.target.value)}
          placeholder="Enter user ID"
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button
          onClick={addUser}
          style= {{ padding '0.5rem', backgroundColor 'lighblue' }}
        >
          Add User
        </button>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: '0.5rem' }}>
            <strong>{user.name}</strong> -{' '}
            <span
              style={{
                color: user.onlineStatus === 'online' ? 'green' : 'gray',
                fontweight: 'bold',
              }}
            >
              {user.onlineStatus}
            </span>
            <button
              onClick={() = deleteId(user.id)}
              style={{ color: 'red', marginLeft: '1rem' }}
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}