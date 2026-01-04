import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">RoomFindr</Link>
        <div className="nav-links">
          <Link to="/">Find Rooms</Link>
          {user ? (
            <>
              <Link to="/my-rooms">My Rooms</Link>
              <Link to="/add-room" className="btn-primary">Post Room</Link>
              <button onClick={handleLogout} className="btn-text">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
