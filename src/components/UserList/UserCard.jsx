 import "./UserCard.css";
 import { useState, useEffect, useRef } from 'react';
 
 export default function UserCard( user, onRouteChange) {

  user = user.user;
  
  const memberSince = new Date(user?.created_at).toLocaleDateString(); 
  const avatar = user?.picture ? `http://localhost:3001/${user?.picture}` : 'http://localhost:3001/public/uploads/base_default.png'

  return (
    <>
      <div className="user-container">
        <div className="user-info">
          <a
              href={`/users/${user?.login}`}
              onClick={(e) => {
              e.preventDefault();
              onRouteChange(`user:${user?.user_id}`);
              }}
          >
              <img src={avatar} className="user-avatar" alt="User avatar" />
          </a>
        </div>
        <div className="user-details ml3">
          <p className="user-member">Member since {memberSince}</p>
          <p className="user-name">{user?.login}</p>
          <p className="user-name">{user?.full_name}</p>
          <div style={{display: 'flex', gap: '2em'}}>
            <p className="user-name">{user?.role}</p>
            <p className="user-name">
              <i className="fa-solid fa-star" style={{ color: '#ffd500ff' }}></i>
              {user?.rating}
            </p>
          </div>
      </div>
    </div>
    </>
  )
}