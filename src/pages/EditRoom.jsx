import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const EditRoom = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rent: '',
    property_type: '1 BHK',
    tenant_preference: 'Any',
    contact: ''
  })

  useEffect(() => {
    fetchRoom()
  }, [id])

  const fetchRoom = async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      alert('Error fetching room')
      navigate('/my-rooms')
    } else {
      if (data.owner_id !== user.id) {
        alert('Unauthorized')
        navigate('/')
      }
      setFormData({
        title: data.title,
        location: data.location,
        rent: data.rent,
        property_type: data.property_type,
        tenant_preference: data.tenant_preference,
        contact: data.contact
      })
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          ...formData,
          rent: Number(formData.rent)
        })
        .eq('id', id)

      if (error) throw error

      navigate('/my-rooms')
    } catch (error) {
      alert('Error updating room: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div className="form-container" style={{maxWidth: '600px'}}>
        <h2>Edit Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" required value={formData.title} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input name="location" required value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Rent (₹/month)</label>
            <input name="rent" type="number" required value={formData.rent} onChange={handleChange} />
          </div>

          <div style={{display:'flex', gap:'1rem'}}>
            <div className="form-group" style={{flex:1}}>
              <label>Property Type</label>
              <select name="property_type" value={formData.property_type} onChange={handleChange}>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="1 Room">1 Room</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            <div className="form-group" style={{flex:1}}>
              <label>Tenant Preference</label>
              <select name="tenant_preference" value={formData.tenant_preference} onChange={handleChange}>
                <option value="Any">Any</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Family">Family</option>
                <option value="Girls">Girls</option>
                <option value="Working">Working</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input name="contact" required value={formData.contact} onChange={handleChange} />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Room'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditRoom
