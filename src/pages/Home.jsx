import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { MapPin, Home as HomeIcon, Users, DollarSign } from 'lucide-react'

const Home = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [location, setLocation] = useState('')
  const [maxRent, setMaxRent] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [tenantPreference, setTenantPreference] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRooms()
    }, 500)
    return () => clearTimeout(timer)
  }, [location, maxRent, propertyType, tenantPreference])

  const fetchRooms = async () => {
    setLoading(true)
    let query = supabase.from('rooms').select('*')

    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    if (maxRent) {
      query = query.lte('rent', maxRent)
    }
    if (propertyType) {
      query = query.eq('property_type', propertyType)
    }
    if (tenantPreference) {
      query = query.eq('tenant_preference', tenantPreference)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching rooms:', error)
    } else {
      setRooms(data || [])
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <div className="filters">
        <input 
          placeholder="Location (e.g., Downtown)" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="Max Rent" 
          value={maxRent}
          onChange={(e) => setMaxRent(e.target.value)}
        />
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option value="">All Property Types</option>
          <option value="1 BHK">1 BHK</option>
          <option value="2 BHK">2 BHK</option>
          <option value="3 BHK">3 BHK</option>
          <option value="1 Room">1 Room</option>
          <option value="Shared">Shared</option>
        </select>
        <select value={tenantPreference} onChange={(e) => setTenantPreference(e.target.value)}>
          <option value="">All Preferences</option>
          <option value="Any">Any</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Family">Family</option>
          <option value="Girls">Girls</option>
          <option value="Working">Working</option>
        </select>
      </div>

      {loading ? (
        <p>Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p>No rooms found matching your criteria.</p>
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
                <div className="room-details">
                  <span><MapPin size={16} style={{marginBottom:'-3px'}}/> {room.location}</span>
                </div>
                <div className="room-details">
                   <span><HomeIcon size={16} style={{marginBottom:'-3px'}}/> {room.property_type}</span>
                   <span><Users size={16} style={{marginBottom:'-3px'}}/> {room.tenant_preference}</span>
                </div>
                <div style={{marginTop: '1rem', fontSize: '0.9rem'}}>
                  <strong>Contact:</strong> {room.contact}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
