import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyListings, deleteProperty } from '../services/propertyService'
import { useAuth } from '../context/AuthContext'
import PropertyCard from '../components/PropertyCard'
import { useTitle } from '../hooks/useTitle'
import './Dashboard.css'

export default function Dashboard() {
  useTitle('My Listings')
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyListings()
      .then(res => setProperties(res.data.properties))
      .catch(() => setError('Failed to load your listings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this listing?')) return
    try {
      await deleteProperty(id)
      setProperties(ps => ps.filter(p => p._id !== id))
    } catch {
      alert('Delete failed. Please try again.')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h2>My Listings</h2>
          <p>Welcome back, {user?.fullName || user?.username}</p>
        </div>
        <Link to="/create-property" className="btn-create">+ New Listing</Link>
      </div>

      {loading && <div className="state-box"><div className="spinner" /><p>Loading your listings...</p></div>}
      {!loading && error && <div className="state-box error"><p>⚠️ {error}</p></div>}
      {!loading && !error && properties.length === 0 && (
        <div className="state-box empty">
          <p>📋 You haven't listed any properties yet.</p>
          <Link to="/create-property" className="btn-create" style={{display:'inline-block',marginTop:'1rem'}}>Create your first listing</Link>
        </div>
      )}
      {!loading && !error && properties.length > 0 && (
        <div className="grid">
          {properties.map(p => (
            <PropertyCard key={p._id} property={p} showActions onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}