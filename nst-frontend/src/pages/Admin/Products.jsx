import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminProducts(){
  const { isAdmin } = useAuth();
  if (!isAdmin) return <div>Access denied.</div>;
  return (
    <div>
      <h2>Admin — Products</h2>
      <p>Product management UI not implemented yet.</p>
    </div>
  );
}
