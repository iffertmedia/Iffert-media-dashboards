import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">ShopLink</h2>
        <nav className="flex flex-col space-y-2">
          <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/campaigns" className="hover:text-gray-300">Campaigns</Link>
          <Link to="/login" className="hover:text-gray-300">Login</Link>
          <Link to="/admin/textmanager" className="hover:text-gray-300">Admin</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
