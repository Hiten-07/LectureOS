import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const navigate = useNavigate()

  const handleUpload = async () => {
    if (!file || loading) return
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post(`${API}/upload`, formData)
      navigate(`/lecture/${res.data.lecture_id}`)
    } catch {
      setError('Upload failed. Make sure the backend is running.')
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') setFile(dropped)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'var(--bg-secondary)'
    }}>

      {/* Logo + header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '44px', height: '44px',
          background: 'var(--accent)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '20px'
        }}>📚</div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.02em' }}>
          LectureOS
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
          Turn any lecture into a learning system
        </p>
      </div>

      {/* Upload card */}
      <div style={{
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-md)',
        width: '100%',
        maxWidth: '460px',
        padding: '1.75rem'
      }}>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => document.getElementById('fileInput').click()}
          style={{
            border: `2px dashed ${dragOver ? 'var(--accent)' : file ? 'var(--success)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragOver ? 'var(--accent-light)' : file ? '#f0fdf4' : 'var(--bg-secondary)',
            transition: 'all 0.15s ease',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
            {file ? '✅' : '📄'}
          </div>
          {file ? (
            <>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                {file.name}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {(file.size / 1024).toFixed(0)} KB · Click to change
              </p>
            </>
          ) : (
            <>
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                Drop your PDF here
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                or click to browse
              </p>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        {/* Supported formats */}
        <div style={{
          display: 'flex', gap: '0.5rem',
          marginBottom: '1.25rem', flexWrap: 'wrap'
        }}>
          {['PDF', 'Lecture notes', 'Research papers', 'Textbook chapters'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '20px',
              color: 'var(--text-secondary)'
            }}>{tag}</span>
          ))}
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius)',
            padding: '0.6rem 0.85rem',
            color: '#dc2626',
            fontSize: '0.8rem',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: file && !loading ? 'var(--accent)' : 'var(--border)',
            color: file && !loading ? 'white' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'background 0.15s',
            cursor: file && !loading ? 'pointer' : 'not-allowed'
          }}
        >
          {loading ? (
            <span>Processing lecture... ⏳</span>
          ) : (
            <span>Upload & Analyse →</span>
          )}
        </button>
      </div>

      {/* Footer */}
      <p style={{
        marginTop: '2rem',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        textAlign: 'center'
      }}>
        Powered by local AI · Your data never leaves your machine
      </p>
    </div>
  )
}
