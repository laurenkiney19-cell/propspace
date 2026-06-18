import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createProperty } from '../services/propertyService'
import ImageUploader from '../components/ImageUploader'
import { useTitle } from '../hooks/useTitle'

export default function CreateProperty() {
  useTitle('List a Property')
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: '', listingType: ''
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageData, setImageData] = useState({ existingUrls: [], newFiles: [] })

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Required.'
    if (!form.description.trim()) errs.description = 'Required.'
    if (!form.price || Number(form.price) <= 0) errs.price = 'Enter a valid price.'
    if (!form.city.trim()) errs.city = 'Required.'
    if (!form.country.trim()) errs.country = 'Required.'
    if (!form.type) errs.type = 'Required.'
    if (!form.listingType) errs.listingType = 'Required.'
    return errs
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    imageData.newFiles.forEach(file => fd.append('images', file))

    setLoading(true); setServerError('')
    try {
      await createProperty(fd)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create listing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>List a Property</h2>
        {serverError && <div className="alert-error">{serverError}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handle} placeholder="Spacious 2BR Apartment..." />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input name="price" type="number" value={form.price} onChange={handle} placeholder="1200" />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows={4} value={form.description} onChange={handle} placeholder="Describe the property..." />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handle} placeholder="New York" />
              {errors.city && <span className="field-error">{errors.city}</span>}
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input name="country" value={form.country} onChange={handle} placeholder="USA" />
              {errors.country && <span className="field-error">{errors.country}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Type *</label>
              <select name="type" value={form.type} onChange={handle}>
                <option value="">Select type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
              </select>
              {errors.type && <span className="field-error">{errors.type}</span>}
            </div>
            <div className="form-group">
              <label>Listing Type *</label>
              <select name="listingType" value={form.listingType} onChange={handle}>
                <option value="">Select</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
              {errors.listingType && <span className="field-error">{errors.listingType}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Property Images (up to 5)</label>
            <ImageUploader onChange={setImageData} />
          </div>
          <div className="form-actions">
            <Link to="/dashboard" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}