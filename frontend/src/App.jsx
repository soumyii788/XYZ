import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import StickySideTabs from "./components/StickySideTabs";
import SimulationModal from "./components/SimulationModal";
import TrackingModal from "./components/TrackingModal";
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 gap-3">
      <div className="w-8 h-8 border-3 border-slate-700 border-t-[#d61f26] rounded-full animate-spin" />
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
        Authenticating XYZ Session...
      </p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // If user is not logged in, render plain children
  if (!user) return <div className="min-h-screen bg-slate-50">{children}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative text-slate-800">
      {/* Top Enterprise Dark Navbar */}
      <Navbar 
        onOpenSimulation={() => setIsSimulationOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full focus:outline-none">
        {React.cloneElement(children, {
          onOpenSimulation: () => setIsSimulationOpen(true),
          onOpenTracking: () => setIsTrackingOpen(true)
        })}
      </main>

      {/* Floating Sticky Side Tabs on Right Edge (Mahindra style) */}
      <StickySideTabs 
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenSimulation={() => setIsSimulationOpen(true)}
      />

      {/* Carrier Ingest Simulation Modal */}
      <SimulationModal 
        isOpen={isSimulationOpen} 
        onClose={() => setIsSimulationOpen(false)} 
      />

      {/* Quick Order & Case Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
