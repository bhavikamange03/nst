import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminOrders(){
  const { isAdmin } = useAuth();
  if (!isAdmin) return <div>Access denied.</div>;
  return (
    <div>
      <h2>Admin — Orders</h2>
      <p>Order viewing UI not implemented yet.</p>
    </div>
  );
}
