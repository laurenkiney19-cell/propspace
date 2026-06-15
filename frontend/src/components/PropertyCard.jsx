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
        <p className="location">📍 {property.city}, {property.country}</p>
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