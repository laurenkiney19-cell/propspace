import { useState } from 'react'
import './FilterSidebar.css'

export default function FilterSidebar({ onFilter }) {
  const [filters, setFilters] = useState({ city: '', type: '', listingType: '', minPrice: '', maxPrice: '' })

  const handle = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))
  const apply = () => onFilter(filters)
  const clear = () => { const empty = { city: '', type: '', listingType: '', minPrice: '', maxPrice: '' }; setFilters(empty); onFilter(empty) }

  return (
    <aside className="sidebar">
      <h3>Filter Properties</h3>
      <div className="filter-group">
        <label>City</label>
        <input name="city" value={filters.city} onChange={handle} placeholder="e.g. New York" />
      </div>
      <div className="filter-group">
        <label>Property Type</label>
        <select name="type" value={filters.type} onChange={handle}>
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Studio">Studio</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Listing</label>
        <select name="listingType" value={filters.listingType} onChange={handle}>
          <option value="">Rent &amp; Sale</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Min Price ($)</label>
        <input type="number" name="minPrice" value={filters.minPrice} onChange={handle} placeholder="0" />
      </div>
      <div className="filter-group">
        <label>Max Price ($)</label>
        <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handle} placeholder="Any" />
      </div>
      <button className="btn-apply" onClick={apply}>Apply Filters</button>
      <button className="btn-clear" onClick={clear}>Clear</button>
    </aside>
  )
}