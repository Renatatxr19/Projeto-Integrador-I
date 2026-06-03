import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop"; // Ajuste o restante do nome da pasta se necessário
import ProtectedRoute from "./components/ProtectedRoute"; // Ajuste o restante do nome da pasta se necessário
import PortalPage from './pages/PortalPage.jsx';
import DonorAuthChoicePage from './pages/DonorAuthChoicePage.jsx';
import DonorRegisterPage from './pages/DonorRegisterPage.jsx';
import DonorLoginPage from './pages/DonorLoginPage.jsx';
import InstitutionAuthChoicePage from './pages/InstitutionAuthChoicePage.jsx';
import InstitutionLoginPage from './pages/InstitutionLoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import FilterPage from './pages/FilterPage.jsx';
import ONGDetailsPage from './pages/ONGDetailsPage.jsx';
import VoucherPage from './pages/VoucherPage.jsx';
import ValidationPage from './pages/ValidationPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import InstitutionRegisterPage from './pages/InstitutionRegisterPage.jsx';
import InstitutionDashboardPage from './pages/InstitutionDashboardPage.jsx';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PortalPage />} />
          <Route path="/donor/auth-choice" element={<DonorAuthChoicePage />} />
          <Route path="/donor/register" element={<DonorRegisterPage />} />
          <Route path="/donor/login" element={<DonorLoginPage />} />
          <Route path="/institution/auth-choice" element={<InstitutionAuthChoicePage />} />
          <Route path="/institution/login" element={<InstitutionLoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filters"
            element={
              <ProtectedRoute>
                <FilterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ong/:id"
            element={
              <ProtectedRoute>
                <ONGDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/voucher"
            element={
              <ProtectedRoute>
                <VoucherPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/validation"
            element={
              <ProtectedRoute>
                <ValidationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/register-institution" element={<InstitutionRegisterPage />} />
          <Route
            path="/institution/dashboard"
            element={
              <ProtectedRoute>
                <InstitutionDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;




