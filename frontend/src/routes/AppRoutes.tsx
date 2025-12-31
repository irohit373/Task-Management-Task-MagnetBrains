import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';

// Dashboard
import { Dashboard } from '../pages/dashboard/Dashboard';

// Task Pages
import { TasksPage } from '../pages/tasks/TasksPage';
import { CreateTask } from '../pages/tasks/CreateTask';
import { TaskDetail } from '../pages/tasks/TaskDetail';

// User Pages
import { UsersPage } from '../pages/users/UsersPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Private Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <TasksPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks/create"
        element={
          <PrivateRoute>
            <CreateTask />
          </PrivateRoute>
        }
      />

      <Route
        path="/tasks/:id"
        element={
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/users"
        element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        }
      />

      {/* Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};