import { useState } from 'react'

export default function ImageUploader({ existingImages = [], onChange }) {
  const [previews, setPreviews] = useState(existingImages)
  const [newFiles, setNewFiles] = useState([])
  const [existingUrls, setExistingUrls] = useState(existingImages)

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const total = existingUrls.length + newFiles.length + files.length
    if (total > 5) { alert('Maximum 5 images allowed.'); return }

    const nextFiles = [...newFiles, ...files]
    setNewFiles(nextFiles)

    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPreviews(p => [...p, ev.target.result])
      }
      reader.readAsDataURL(file)
    })

    onChange({ existingUrls, newFiles: nextFiles })
  }

  const removeExisting = (idx) => {
    const updated = existingUrls.filter((_, i) => i !== idx)
    const updatedPreviews = previews.filter((_, i) => i !== idx)
    setExistingUrls(updated)
    setPreviews(updatedPreviews)
    onChange({ existingUrls: updated, newFiles })
  }

  const removeNew = (idx) => {
    const newFileIdx = idx - existingUrls.length
    const updatedFiles = newFiles.filter((_, i) => i !== newFileIdx)
    const updatedPreviews = previews.filter((_, i) => i !== idx)
    setNewFiles(updatedFiles)
    setPreviews(updatedPreviews)
    onChange({ existingUrls, newFiles: updatedFiles })
  }

  const remove = (idx) => {
    if (idx < existingUrls.length) removeExisting(idx)
    else removeNew(idx)
  }

  return (
    <div>
      <div className="upload-area" onClick={() => document.getElementById('img-input').click()}>
        <input
          id="img-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={handleFiles}
          style={{ display: 'none' }}
        />
        <span className="upload-icon">📷</span>
        <p>Click to select images from your device</p>
        <small>JPG, PNG, WEBP — max 5MB each, up to 5 images</small>
      </div>

      {previews.length > 0 && (
        <div className="image-previews">
          {previews.map((src, i) => (
            <div key={i} className="preview-item">
              <img src={src} alt={`preview ${i + 1}`} />
              <button type="button" className="remove-btn" onClick={() => remove(i)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}