import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AddRoom from './pages/AddRoom'
import EditRoom from './pages/EditRoom'
import MyRooms from './pages/MyRooms'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/add-room" 
            element={
              <ProtectedRoute>
                <AddRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-room/:id" 
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-rooms" 
            element={
              <ProtectedRoute>
                <MyRooms />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App