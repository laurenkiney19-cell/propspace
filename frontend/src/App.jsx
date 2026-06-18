import PropTypes from 'prop-types'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PropertyDetail from './pages/PropertyDetail'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import CreateProperty from './pages/CreateProperty'
import EditProperty from './pages/EditProperty'

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

function GuestRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? <Navigate to="/" replace /> : children
}

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/create-property" element={<PrivateRoute><CreateProperty /></PrivateRoute>} />
        <Route path="/edit-property/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}