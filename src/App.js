import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Feedback from "./pages/Feedback";
import Analytics from "./pages/Analytics";
import UserManagement from "./pages/UserManagement";
import Resources from "./pages/Resources";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import { AppDataProvider } from "./context/AppDataContext";
import { AuthProvider } from "./context/AuthContext";

function ProtectedPage({ children }) {
  return <PrivateRoute>{children}</PrivateRoute>;
}

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/tasks" element={<ProtectedPage><Task /></ProtectedPage>} />
            <Route path="/feedback" element={<ProtectedPage><Feedback /></ProtectedPage>} />
            <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
            <Route path="/users" element={<ProtectedPage><UserManagement /></ProtectedPage>} />
            <Route path="/resources" element={<ProtectedPage><Resources /></ProtectedPage>} />
            <Route path="/notifications" element={<ProtectedPage><Notifications /></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
