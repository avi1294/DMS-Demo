import { Routes, Route, Navigate } from 'react-router-dom'
import { SidebarProvider } from './context/SidebarContext'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/common/Toast'

// Layouts
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Main Pages
import DashboardPage from './pages/dashboard/DashboardPage'
import MembersPage from './pages/members/MembersPage'
import AddMemberPage from './pages/members/AddMemberPage'
import EditMemberPage from './pages/members/EditMemberPage'
import EnterDataPage from './pages/data-entry/EnterDataPage'
import ViewDataPage from './pages/data-entry/ViewDataPage'
import DefineFieldsPage from './pages/data-entry/DefineFieldsPage'
import ScanDocsPage from './pages/scanning/ScanDocsPage'
import RejectHoldPage from './pages/scanning/RejectHoldPage'
import VerifyDocsPage from './pages/quality-check/VerifyDocsPage'
import GuestsPage from './pages/guests/GuestsPage'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <ToastProvider>
          <SidebarProvider>
            <Routes>
              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Main App Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<Navigate to="/" replace />} />

                {/* Members */}
                <Route path="/members" element={<MembersPage />} />
                <Route path="/members/add" element={<AddMemberPage />} />
                <Route path="/members/edit/:id" element={<EditMemberPage />} />

                {/* Data Entry */}
                <Route path="/data-entry/add" element={<EnterDataPage />} />
                <Route path="/data-entry/view" element={<ViewDataPage />} />
                <Route path="/data-entry/define-fields" element={<DefineFieldsPage />} />

                {/* Scanning */}
                <Route path="/scanning/scan-docs" element={<ScanDocsPage />} />
                <Route path="/scanning/reject-hold" element={<RejectHoldPage />} />

                {/* Quality Check */}
                <Route path="/quality-check/verify" element={<VerifyDocsPage />} />

                {/* Guests */}
                <Route path="/guests" element={<GuestsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Toast />
          </SidebarProvider>
        </ToastProvider>
      </DataProvider>
    </AuthProvider>
  )
}

export default App
