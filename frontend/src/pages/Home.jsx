import { useState, useEffect } from 'react'
import { getProperties } from '../services/propertyService'
import PropertyCard from '../components/PropertyCard'
import FilterSidebar from '../components/FilterSidebar'
import { useTitle } from '../hooks/useTitle'
import home1 from '../assets/home1.jpg'
import home2 from '../assets/home2.jpg'
import home3 from '../assets/home3.jpg'
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

  const featuredProperties = [
    { id: 1, image: home1, title: 'Modern Apartment - Down Town', price: 'FCFA 150,000/mo', location: 'Buea, Cameroon' },
    { id: 2, image: home2, title: 'Comfortable Studio - New Layout', price: 'FCFA 90,000/mo', location: 'Buea, Cameroon' },
    { id: 3, image: home3, title: 'Luxury Penthouse - Hill View', price: 'FCFA 300,000/mo', location: 'Buea, Cameroon' }
  ]

  return (
    <>
      <section className="hero">
        <h1>Find Your Perfect Space in Buea</h1>
        <p>Browse quality properties for rent and sale across Cameroon's most vibrant city.</p>
      </section>

      <section className="featured-section">
        <div className="featured-container">
          <h2>Featured Properties</h2>
          <div className="featured-grid">
            {featuredProperties.map(property => (
              <div key={property.id} className="featured-card">
                <img src={property.image} alt={property.title} />
                <div className="featured-info">
                  <h3>{property.title}</h3>
                  <p className="featured-location">{property.location}</p>
                  <p className="featured-price">{property.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            <div className="state-box error"><p><span className="inline-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" fill="currentColor"/></svg>
            </span>{error}</p></div>
          )}
          {!loading && !error && properties.length === 0 && (
            <div className="state-box empty">
              <p><span className="inline-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 2a8 8 0 1 0 5.29 14.29l4.3 4.3 1.42-1.42-4.3-4.3A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" fill="currentColor"/></svg>
              </span>No properties match your search. Try adjusting your filters.</p>
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