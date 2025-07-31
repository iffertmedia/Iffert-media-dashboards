import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CampaignsScreen from './pages/CampaignsScreen.tsx';
import ExclusiveCampaignsScreen from './pages/ExclusiveCampaignsScreen.tsx';
import CreatorDetailScreen from './pages/CreatorDetailScreen.tsx';
import AdminScreen from './pages/AdminScreen.tsx';
import CampaignDetailScreen from './pages/CampaignDetailScreen.tsx';
import DashboardScreen from './pages/DashboardScreen.tsx';
import DiscordScreen from './pages/DiscordScreen.tsx';
import CreatorShowcaseScreen from './pages/CreatorShowcaseScreen.tsx';
import HomeScreen from './pages/HomeScreen.tsx';
import LoginScreen from './pages/LoginScreen.tsx';
import TextManagerScreen from './pages/admin/TextManagerScreen.tsx';
import ProductManagerScreen from './pages/admin/ProductManagerScreen.tsx';
import CreatorManagerScreen from './pages/admin/CreatorManagerScreen.tsx';
import CreatorCollabAdmin from './pages/admin/CreatorCollabAdmin.tsx';
import CampaignDetailsAdmin from './pages/admin/CampaignDetailsAdmin.tsx';
import SheetsDebugScreen from './pages/admin/SheetsDebugScreen.tsx';
import SpreadsheetDebugScreen from './pages/admin/SpreadsheetDebugScreen.tsx';
import CampaignManagerScreen from './pages/admin/CampaignManagerScreen.tsx';
import NotificationManagerScreen from './pages/admin/NotificationManagerScreen.tsx';
import SettingsManagerScreen from './pages/admin/SettingsManagerScreen.tsx';

export default function App() {
  return (
    <Routes>
        <Route path="/campaigns" element={<CampaignsScreen />} />
        <Route path="/exclusivecampaigns" element={<ExclusiveCampaignsScreen />} />
        <Route path="/creatordetail" element={<CreatorDetailScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
        <Route path="/campaigndetail" element={<CampaignDetailScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/discord" element={<DiscordScreen />} />
        <Route path="/creatorshowcase" element={<CreatorShowcaseScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/admin/textmanager" element={<TextManagerScreen />} />
        <Route path="/admin/productmanager" element={<ProductManagerScreen />} />
        <Route path="/admin/creatormanager" element={<CreatorManagerScreen />} />
        <Route path="/admin/creatorcollabadmin" element={<CreatorCollabAdmin />} />
        <Route path="/admin/campaigndetailsadmin" element={<CampaignDetailsAdmin />} />
        <Route path="/admin/sheetsdebug" element={<SheetsDebugScreen />} />
        <Route path="/admin/spreadsheetdebug" element={<SpreadsheetDebugScreen />} />
        <Route path="/admin/campaignmanager" element={<CampaignManagerScreen />} />
        <Route path="/admin/notificationmanager" element={<NotificationManagerScreen />} />
        <Route path="/admin/settingsmanager" element={<SettingsManagerScreen />} />
        <Route path="*" element={<div className="p-4">404 - Page Not Found</div>} />
    </Routes>
  );
}
