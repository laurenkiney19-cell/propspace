import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getPropertyById, updateProperty } from '../services/propertyService'
import ImageUploader from '../components/ImageUploader'
import { useTitle } from '../hooks/useTitle'

export default function EditProperty() {
  useTitle('Edit Listing')
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', price: '', city: '', country: '', type: '', listingType: ''
  })
  const [existingImages, setExistingImages] = useState([])
  const [imageData, setImageData] = useState({ existingUrls: [], newFiles: [] })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    getPropertyById(id)
      .then(res => {
        const p = res.data.property
        setForm({
          title: p.title, description: p.description, price: p.price,
          city: p.city, country: p.country, type: p.type, listingType: p.listingType
        })
        setExistingImages(p.images || [])
        setImageData({ existingUrls: p.images || [], newFiles: [] })
      })
      .catch(() => setServerError('Could not load property.'))
      .finally(() => setFetchLoading(false))
  }, [id])

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
    fd.append('existingImages', JSON.stringify(imageData.existingUrls))
    imageData.newFiles.forEach(file => fd.append('images', file))

    setLoading(true); setServerError('')
    try {
      await updateProperty(id, fd)
      navigate('/dashboard')
    } catch (err) {
      setServerError(err.response?.data?.message || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <div className="form-page"><div className="state-box"><div className="spinner" /></div></div>

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Edit Listing</h2>
        {serverError && <div className="alert-error">{serverError}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handle} />
              {errors.title && <span className="field-error">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input name="price" type="number" value={form.price} onChange={handle} />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows={4} value={form.description} onChange={handle} />
            {errors.description && <span className="field-error">{errors.description}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input name="city" value={form.city} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input name="country" value={form.country} onChange={handle} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Property Type *</label>
              <select name="type" value={form.type} onChange={handle}>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
            <div className="form-group">
              <label>Listing Type *</label>
              <select name="listingType" value={form.listingType} onChange={handle}>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Images (existing + add new, max 5 total)</label>
            <ImageUploader existingImages={existingImages} onChange={setImageData} />
          </div>
          <div className="form-actions">
            <Link to="/dashboard" className="btn-cancel">Cancel</Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}