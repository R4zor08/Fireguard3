import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { UserDashboard } from './pages/UserDashboard';
import { UserAlerts } from './pages/UserAlerts';
import { UserContacts } from './pages/UserContacts';
import { UserSettings } from './pages/UserSettings';
import { UserProfile } from './pages/UserProfile';
import { MapView } from './pages/MapView';
import { SatelliteMapView } from './pages/SatelliteMapView';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { SupportHub } from './pages/SupportHub';
import { DeviceManagement } from './pages/DeviceManagement';
import { HouseholdMonitoring } from './pages/HouseholdMonitoring';
import { NetworkConnectivity } from './pages/NetworkConnectivity';
import { Notifications } from './pages/Notifications';
export function App() {
  return <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Admin Routes */}
          <Route path="/app" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/map" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <MapView />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/satellite" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <SatelliteMapView />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/analytics" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/alerts" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <Alerts />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/support" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <SupportHub />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/devices" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <DeviceManagement />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/households" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <HouseholdMonitoring />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/network" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <NetworkConnectivity />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/notifications" element={<PrivateRoute adminOnly>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </PrivateRoute>} />

          {/* User Routes */}
          <Route path="/app/user-dashboard" element={<PrivateRoute>
                <DashboardLayout userMode>
                  <UserDashboard />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/user-dashboard/alerts" element={<PrivateRoute>
                <DashboardLayout userMode>
                  <UserAlerts />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/user-dashboard/contacts" element={<PrivateRoute>
                <DashboardLayout userMode>
                  <UserContacts />
                </DashboardLayout>
              </PrivateRoute>} />
          <Route path="/app/user-dashboard/profile" element={<PrivateRoute>
                <DashboardLayout userMode>
                  <UserProfile />
                </DashboardLayout>
              </PrivateRoute>} />

          {/* Placeholder routes for user sub-pages to prevent 404s */}
          <Route path="/app/user-dashboard/*" element={<PrivateRoute>
                <DashboardLayout userMode>
                  <UserDashboard />
                </DashboardLayout>
              </PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>;
}