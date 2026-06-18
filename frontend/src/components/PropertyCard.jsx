import { Link } from 'react-router-dom'
import './PropertyCard.css'

export default function PropertyCard({ property, showActions, onDelete }) {
  const img = property.images?.[0] || 'https://placehold.co/400x250?text=No+Image'

  return (
    <div className="card">
      <div className="card-image">
        <img src={img} alt={property.title} />
        <span className={`badge ${property.listingType === 'sale' ? 'sale' : ''}`}>
          For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
        </span>
      </div>
      <div className="card-body">
        <span className="type-tag">{property.type}</span>
        <h3>{property.title}</h3>
        <p className="location"><span className="inline-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor"/></svg>
          </span>{property.city}, {property.country}</p>
        <p className="price">
          ${property.price.toLocaleString()}
          {property.listingType === 'rent' && <span> /mo</span>}
        </p>
        <div className="card-footer">
          <Link to={`/property/${property._id}`} className="btn-view">View Details</Link>
          {showActions && (
            <div className="actions">
              <Link to={`/edit-property/${property._id}`} className="btn-edit">Edit</Link>
              <button className="btn-delete" onClick={() => onDelete(property._id)}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}