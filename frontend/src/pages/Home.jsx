import { useState, useEffect } from 'react'
import { getProperties } from '../services/propertyService'
import PropertyCard from '../components/PropertyCard'
import FilterSidebar from '../components/FilterSidebar'
import { useTitle } from '../hooks/useTitle'
import './Home.css'

export default function Home() {
  useTitle('Browse Properties')
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProperties = async (filters = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await getProperties(filters)
      setProperties(res.data.properties)
    } catch {
      setError('Failed to load properties. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

  return (
    <>
      <section className="hero">
        <h1>Find Your Perfect Space</h1>
        <p>Browse thousands of properties for rent and sale across the globe.</p>
      </section>
      <div className="page-layout">
        <FilterSidebar onFilter={fetchProperties} />
        <div className="listings">
          {loading && (
            <div className="state-box">
              <div className="spinner" />
              <p>Loading properties...</p>
            </div>
          )}
          {!loading && error && (
            <div className="state-box error"><p>⚠️ {error}</p></div>
          )}
          {!loading && !error && properties.length === 0 && (
            <div className="state-box empty">
              <p>🔍 No properties match your search. Try adjusting your filters.</p>
            </div>
          )}
          {!loading && !error && properties.length > 0 && (
            <div className="grid">
              {properties.map(p => <PropertyCard key={p._id} property={p} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}