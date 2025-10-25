import UserCard from './UserCard';
import  './UserList.css';
import { useState, useEffect, useRef } from 'react';
 
export default function UserList({ onRouteChange }) {
  const [users, setUsers] = useState([]);
 
 //fetch user
  useEffect(() => {
    let cancelled = false;
    
    async function loadAuthor() {
      try {                
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);
        if (!res.ok) throw new Error('Error loading authors');
        const data = await res.json();
        if (!cancelled) setUsers(data);
      } catch (err) {
        console.error('Error loading authors:', err);
      }
    }
    loadAuthor();
    return () => { cancelled = true };
  },[]);

  console.log(users)
  return (
    <>
    <div className="new-user-container">
      <div className="user-list">
        {users.map(user => (
          <UserCard key={user.user_id} user={user} onRouteChange={onRouteChange}/>
        ))}
      </div>
    </div>
    </>
  )
}