import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

// Auto-generated route imports
import DashboardScreen from './pages/DashboardScreen';
import CampaignsScreen from './pages/CampaignsScreen';
import LoginScreen from './pages/LoginScreen';
import TextManagerScreen from './pages/admin/TextManagerScreen';
import CampaignDetailScreen from './pages/CampaignDetailScreen';
import CreatorDetailScreen from './pages/CreatorDetailScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/campaigns" element={<CampaignsScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/campaign/:id" element={<CampaignDetailScreen />} />
        <Route path="/creator/:id" element={<CreatorDetailScreen />} />
        <Route path="/admin/textmanager" element={<TextManagerScreen />} />
      </Route>
      <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
    </Routes>
  );
}
