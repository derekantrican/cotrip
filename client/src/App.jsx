import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TripList from './components/TripList';
import TripView from './components/TripView';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<TripList />} />
        <Route path="/trip/:id" element={<TripView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
