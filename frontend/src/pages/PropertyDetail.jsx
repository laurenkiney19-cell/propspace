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
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getPropertyById(id, controller.signal)
      .then((res) => setProperty(res.data.property))
      .catch((err) => {
        if (err.name === 'CanceledError') return;
        setError('Unable to load property details.');
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
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
          <p><span className="inline-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" fill="currentColor"/></svg>
          </span>{error || 'Property not found.'}</p>
          <Link to="/" className="btn-primary">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail-page">
      <div className="detail-header">
        <Link to="/" className="btn-secondary"><svg className="inline-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Back to listings</Link>
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
          <p className="detail-location"><span className="inline-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" fill="currentColor"/></svg>
            </span>{property.city}, {property.country}</p>
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
