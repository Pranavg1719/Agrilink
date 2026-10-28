import React from 'react'
import { X, MapPin, FlaskConical, ArrowRight, Camera } from 'lucide-react'
import { CROPS_DATA } from './HomeLandingView'

interface CropDetailsModalProps {
  cropId: string | null
  onClose: () => void
  onLaunchAiScan: () => void
  onPlaceBid: () => void
}

export const CropDetailsModal: React.FC<CropDetailsModalProps> = ({
  cropId,
  onClose,
  onLaunchAiScan,
  onPlaceBid
}) => {
  if (!cropId) return null
  const crop = CROPS_DATA.find((c) => c.id === cropId)
  if (!crop) return null

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X style={{ width: 17, height: 17 }} />
        </button>

        <img
          className="detail-image"
          src={crop.image}
          alt={crop.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = '/crops/wheat.svg'
          }}
        />

        <span className="sample-tag">
          <FlaskConical style={{ width: 12, height: 12 }} /> Sample listing
        </span>

        <h2 id="modalTitle" style={{ marginTop: 10 }}>
          {crop.name}
        </h2>
        <p className="modal-sub" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
          <MapPin style={{ width: 13, height: 13 }} /> {crop.location}
        </p>

        <div className="detail-meta">
          <div>
            <small>Asking price</small>
            <strong>₹{crop.price} / kg</strong>
          </div>
          <div>
            <small>Quantity</small>
            <strong>{crop.quantity}</strong>
          </div>
          <div>
            <small>Listing status</small>
            <strong>Demo only</strong>
          </div>
        </div>

        <p className="modal-sub">
          {crop.description} This is a verified sample listing. Asking prices and quantities reflect recent APMC mandi data.
        </p>

        <div className="notice">
          Estimate from photos, not a certification. Physical inspection remains mandatory before deal confirmation.
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              onClose()
              onLaunchAiScan()
            }}
          >
            <Camera style={{ width: 15, height: 15 }} /> Analyze Quality with AI
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              onClose()
              onPlaceBid()
            }}
          >
            Place a bid <ArrowRight style={{ width: 15, height: 15 }} />
          </button>
        </div>
      </div>
    </div>
  )
}
