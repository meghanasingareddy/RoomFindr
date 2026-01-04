import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { Trash2, Edit } from 'lucide-react'

const MyRooms = () => {
  const { user } = useAuth()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) fetchMyRooms()
  }, [user])

  const fetchMyRooms = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('owner_id', user.id)
    
    if (error) console.error(error)
    else setRooms(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert('Error deleting room')
    } else {
      setRooms(rooms.filter(r => r.id !== id))
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h2>My Rooms</h2>
      {rooms.length === 0 ? (
        <p>You haven't posted any rooms yet.</p>
      ) : (
        <div className="room-grid">
           {rooms.map(room => (
            <div key={room.id} className="room-card">
              {room.images && room.images.length > 0 ? (
                 <img src={room.images[0]} alt={room.title} className="room-image" />
              ) : (
                <div className="room-image" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>No Image</div>
              )}
              <div className="room-content">
                <h3>{room.title}</h3>
                <div className="room-price">₹{room.rent}/mo</div>
                <div style={{marginTop: '1rem', display: 'flex', gap: '0.5rem'}}>
                  <button 
                    onClick={() => handleDelete(room.id)}
                    style={{background:'#ef4444', padding:'0.5rem', width:'auto', display:'flex', alignItems:'center', gap:'0.25rem'}}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  <Link 
                    to={`/edit-room/${room.id}`}
                    className="btn-primary"
                    style={{padding:'0.5rem', width:'auto', display:'flex', alignItems:'center', gap:'0.25rem', textDecoration:'none', fontSize:'0.9rem'}}
                  >
                    <Edit size={16} /> Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRooms
