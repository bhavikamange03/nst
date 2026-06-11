import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers(){
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAdmin) return;
    axios.get('/admin/users').then(res => setUsers(res.data)).catch(err => setError(err.response?.data || err.message));
  }, [isAdmin]);

  if (!isAdmin) return <div>Access denied.</div>;

  return (
    <div>
      <h2>Admin — Users</h2>
      {error && <div style={{color:'red'}}>{JSON.stringify(error)}</div>}
      <table>
        <thead>
          <tr><th>ID</th><th>Email</th><th>Role</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}><td>{u.id}</td><td>{u.email}</td><td>{u.role}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
