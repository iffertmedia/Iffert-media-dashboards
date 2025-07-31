import React from 'react';import { Routes, Route } from 'react-router-dom';
    export default function App() {
      return (
        <Routes>
          <Route path="/" element={<div className="text-2xl font-bold p-4">
          Welcome to ShopLink Web Dashboard</div>} />
        </Routes>
      );
    }