import React, { useState } from 'react'
import { 
  X, 
  Sprout, 
  ArrowRight, 
  Check, 
  UserCheck, 
  Truck, 
  Store, 
  ShieldCheck, 
  Users, 
  ShoppingBag,
  Headphones
} from 'lucide-react'
import { useAuth, type UserRole, INDIVIDUAL_PORTALS } from '@/context/AuthContext'

interface IndividualLoginModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'signup'
}

const ROLE_ICONS: Record<UserRole, any> = {
  'Farmer': Sprout,
  'Buyer / retailer': ShoppingBag,
  'Inventory vendor': Store,
  'Customer': ShoppingBag,
  'Workers’ Leader': Users,
  'Worker': UserCheck,
  'Transport partner': Truck,
  'Delivery partner': Truck,
  'Support operator': Headphones,
  'Administrator': ShieldCheck
}

export const IndividualLoginModal: React.FC<IndividualLoginModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { loginIndividual, customLogin, portals } = useAuth()
  const [mode, setMode] = useState<'portals' | 'selected' | 'signup'>(
    initialMode === 'signup' ? 'signup' : 'portals'
  )
  const [selectedRole, setSelectedRole] = useState<UserRole>('Farmer')
  const [password, setPassword] = useState('demo1234')
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customPassword, setCustomPassword] = useState('')
  const [customRole, setCustomRole] = useState<UserRole>('Farmer')

  if (!isOpen) return null

  const activePortal = portals[selectedRole]
  const Icon = ROLE_ICONS[selectedRole] || Sprout

  const handleQuickLogin = (role: UserRole) => {
    loginIndividual(role)
    onClose()
  }

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault()
    loginIndividual(selectedRole)
    onClose()
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customEmail || !customName) return
    customLogin(customEmail, customRole, customName)
    onClose()
  }

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

        {/* Brand Logo */}
        <div className="brand modal-logo">
          <span className="brand-mark">
            <Sprout style={{ width: 20, height: 20 }} />
          </span>
          AgriLink
        </div>

        {/* Mode 1: 10 Individual Portals Grid */}
        {mode === 'portals' && (
          <div>
            <h2 id="modalTitle">Individual Role Portals</h2>
            <p className="modal-sub">
              Each participant in the agricultural pipeline has a dedicated individual login and permissions. Choose your portal:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, maxHeight: 380, overflowY: 'auto', paddingRight: 4, marginBottom: 16 }}>
              {(Object.keys(portals) as UserRole[]).map((r) => {
                const p = portals[r]
                const RoleIcon = ROLE_ICONS[r]
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r)
                      setMode('selected')
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: 12,
                      border: '1px solid #e2e9e0',
                      background: '#fff',
                      textAlign: 'left',
                      transition: 'all 0.18s'
                    }}
                  >
                    <div className="icon-box" style={{ width: 38, height: 38, borderRadius: 8 }}>
                      <RoleIcon style={{ width: 18, height: 18 }} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: 13, color: '#1c2e24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r}
                      </strong>
                      <span style={{ display: 'block', fontSize: 11, color: '#68786d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.fullName}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e9e0', paddingTop: 14 }}>
              <span style={{ fontSize: 12, color: '#68786d' }}>Need a new personal account?</span>
              <button
                type="button"
                className="text-button"
                onClick={() => setMode('signup')}
              >
                Create individual account &rarr;
              </button>
            </div>
          </div>
        )}

        {/* Mode 2: Selected Individual Login Form */}
        {mode === 'selected' && (
          <form onSubmit={handleFormLogin} className="form-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sample-tag">
                <Icon style={{ width: 12, height: 12 }} /> {selectedRole} Portal
              </span>
              <button
                type="button"
                className="text-button"
                onClick={() => setMode('portals')}
              >
                &larr; All Role Portals
              </button>
            </div>

            <h2 id="modalTitle">Sign in as {activePortal.fullName}</h2>
            <p className="modal-sub" style={{ margin: '4px 0 12px' }}>
              {activePortal.description} &bull; {activePortal.location}
            </p>

            <div className="notice success">
              Verified Persona: <strong>{activePortal.role}</strong> &bull; Location: <strong>{activePortal.location}</strong>
            </div>

            <div className="field">
              <label htmlFor="indEmail">Email address</label>
              <input
                id="indEmail"
                type="email"
                className="field-control"
                value={activePortal.email}
                readOnly
              />
            </div>

            <div className="field">
              <label htmlFor="indPassword">Password</label>
              <input
                id="indPassword"
                type="password"
                className="field-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary form-submit">
              Sign in to {selectedRole} Portal <ArrowRight style={{ width: 16, height: 16 }} />
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', marginTop: 6 }}
              onClick={() => handleQuickLogin(selectedRole)}
            >
              1-Click Instant Demo Login
            </button>
          </form>
        )}

        {/* Mode 3: Custom Signup Form */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="form-grid">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="sample-tag">New Registration</span>
              <button
                type="button"
                className="text-button"
                onClick={() => setMode('portals')}
              >
                &larr; Back to Portals
              </button>
            </div>

            <h2 id="modalTitle">Join AgriLink</h2>
            <p className="modal-sub" style={{ margin: '4px 0 12px' }}>
              Create an individual account and choose your specific role in the pipeline.
            </p>

            <div className="field">
              <label htmlFor="supName">Full name</label>
              <input
                id="supName"
                type="text"
                className="field-control"
                required
                placeholder="Your full name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="supRole">Individual Role</label>
              <select
                id="supRole"
                className="field-control"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as UserRole)}
              >
                {(Object.keys(portals) as UserRole[]).map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <div className="field-help">Leaders, vendors, and transport partners start in pending approval status.</div>
            </div>

            <div className="field">
              <label htmlFor="supEmail">Email address</label>
              <input
                id="supEmail"
                type="email"
                className="field-control"
                required
                placeholder="you@example.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="supPassword">Password</label>
              <input
                id="supPassword"
                type="password"
                className="field-control"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={customPassword}
                onChange={(e) => setCustomPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary form-submit">
              Create account <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
