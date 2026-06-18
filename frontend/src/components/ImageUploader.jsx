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
        <svg className="upload-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 7h3.18l1.84-2H13l1.82 2H18c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2Zm6 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="currentColor" />
        </svg>
        <p>Click to select images from your device</p>
        <small>JPG, PNG, WEBP — max 5MB each, up to 5 images</small>
      </div>

      {previews.length > 0 && (
        <div className="image-previews">
          {previews.map((src, i) => (
            <div key={i} className="preview-item">
              <img src={src} alt={`preview ${i + 1}`} />
              <button type="button" className="remove-btn" onClick={() => remove(i)}>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7a1 1 0 1 0-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}