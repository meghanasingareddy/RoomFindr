import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

const AddRoom = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    rent: '',
    property_type: '1 BHK',
    tenant_preference: 'Any',
    contact: ''
  })
  const [imageFile, setImageFile] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrls = []
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('room-images')
          .upload(filePath, imageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('room-images').getPublicUrl(filePath)
        imageUrls.push(data.publicUrl)
      }

      const { error } = await supabase.from('rooms').insert([
        {
          ...formData,
          rent: Number(formData.rent),
          owner_id: user.id,
          images: imageUrls
        }
      ])

      if (error) throw error

      navigate('/my-rooms')
    } catch (error) {
      console.error(error)
      alert('Error adding room: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="form-container" style={{maxWidth: '600px'}}>
        <h2>Post a New Room</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input name="title" required value={formData.title} onChange={handleChange} placeholder="e.g. Spacious 1BHK in Downtown" />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input name="location" required value={formData.location} onChange={handleChange} placeholder="City, Area" />
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

          <div className="form-group">
            <label>Room Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Room'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddRoom
