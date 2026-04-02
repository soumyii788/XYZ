import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import SimulationModal from "./components/SimulationModal";
import Dashboard from "./views/Dashboard";
import CaseDetail from "./views/CaseDetail";
import Search from "./views/Search";
import Analytics from "./views/Analytics";
import Account from "./views/Account";
import Login from "./views/Login";
import Onboarding from "./views/Onboarding";
import { AuthProvider, useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 gap-3">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-black rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Authenticating...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // No layout for login/onboarding
  if (!user) return <div className="min-h-screen bg-slate-50">{children}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row relative">
      <Sidebar onPlusClick={() => setIsModalOpen(true)} />

      {/* Content Area */}
      <main className="flex-1 min-w-0 h-full">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pb-32 lg:pb-12 animate-fade-in focus:outline-none">
          {children}
        </div>
      </main>

      <BottomNav onPlusClick={() => setIsModalOpen(true)} />

      <SimulationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute><Layout><Onboarding /></Layout></ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>
          } />
          <Route path="/analysis" element={
            <ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute><Layout><Account /></Layout></ProtectedRoute>
          } />
          <Route path="/case/:id" element={
            <ProtectedRoute><Layout><CaseDetail /></Layout></ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
