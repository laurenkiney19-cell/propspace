import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🏠 PropSpace</Link>
      <div className="nav-links">
        <Link to="/">Browse</Link>
        {isLoggedIn ? (
          <>
            <Link to="/create-property">+ List Property</Link>
            <Link to="/dashboard">My Listings</Link>
            <Link to="/profile">
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="nav-avatar" />
                : <span className="nav-username">{user?.username}</span>
              }
            </Link>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}