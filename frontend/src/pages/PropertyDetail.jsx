import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPropertyById } from '../services/propertyService';
import { useTitle } from '../hooks/useTitle';
import './PropertyDetail.css';

export default function PropertyDetail() {
  useTitle('Property Details');
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    getPropertyById(id)
      .then((res) => setProperty(res.data.property))
      .catch(() => setError('Unable to load property details.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="property-detail-page">
        <div className="state-box">
          <div className="spinner" />
          <p>Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="property-detail-page">
        <div className="state-box error">
          <p>⚠️ {error || 'Property not found.'}</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="detail-header">
        <Link to="/" className="btn-secondary">← Back to listings</Link>
      </div>

      <div className="detail-card">
        <div className="detail-images">
          {property.images?.length > 0 ? (
            property.images.map((src, index) => (
              <img key={index} src={src} alt={`${property.title} ${index + 1}`} />
            ))
          ) : (
            <img src="https://placehold.co/800x500?text=No+Image" alt="No image" />
          )}
        </div>

        <div className="detail-info">
          <span className={`badge ${property.listingType === 'sale' ? 'sale' : ''}`}>
            For {property.listingType === 'rent' ? 'Rent' : 'Sale'}
          </span>
          <h1>{property.title}</h1>
          <p className="detail-location">📍 {property.city}, {property.country}</p>
          <p className="detail-price">
            ${Number(property.price).toLocaleString()}
            {property.listingType === 'rent' && <span> / month</span>}
          </p>
          <p className="detail-description">{property.description}</p>

          <div className="detail-meta">
            <div>
              <strong>Property Type</strong>
              <p>{property.type}</p>
            </div>
            <div>
              <strong>Listed</strong>
              <p>{new Date(property.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="owner-card">
            <h3>Owner</h3>
            <div className="owner-info">
              {property.owner?.avatar ? (
                <img src={property.owner.avatar} alt={property.owner.username} />
              ) : (
                <div className="owner-placeholder">{property.owner?.username?.[0]?.toUpperCase() || 'U'}</div>
              )}
              <div>
                <p className="owner-name">{property.owner?.fullName || property.owner?.username}</p>
                <p className="owner-email">{property.owner?.email}</p>
                {property.owner?.phone && <p className="owner-phone">{property.owner.phone}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
