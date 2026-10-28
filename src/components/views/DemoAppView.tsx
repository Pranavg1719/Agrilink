import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Wheat, 
  Handshake, 
  UsersRound, 
  ShoppingBasket, 
  Truck, 
  Bell, 
  CircleUserRound, 
  Info, 
  Plus, 
  Search, 
  X, 
  ArrowRight, 
  MapPin, 
  Heart, 
  FlaskConical, 
  ClipboardList, 
  Camera, 
  Boxes, 
  CheckCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { useAuth, type UserRole, INDIVIDUAL_PORTALS } from '@/context/AuthContext'
import { AgriLinkBackend, type Listing, type Bid, type Order, type LabourRequest, type AuditEntry } from '@/backend/db'
import { AiCropScanner } from '@/components/farmer/AiCropScanner'
import { RouteOptimizer } from '@/components/logistics/RouteOptimizer'
import { DemoBadge } from '@/components/common/DemoBadge'

interface DemoAppViewProps {
  initialView?: string
  onOpenCropDetails: (cropId: string) => void
  onOpenIndividualLogin: () => void
}

export const DemoAppView: React.FC<DemoAppViewProps> = ({
  initialView = 'dashboard',
  onOpenCropDetails,
  onOpenIndividualLogin
}) => {
  const { currentUser, loginIndividual, logout } = useAuth()
  const [currentView, setCurrentView] = useState(initialView)
  const [cropQuery, setCropQuery] = useState('')
  const [showAiModal, setShowAiModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser?.role || 'Farmer')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // In-code backend state
  const [listings, setListings] = useState<Listing[]>([])
  const [bids, setBids] = useState<Bid[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [labourRequests, setLabourRequests] = useState<LabourRequest[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([])

  const refreshBackendData = () => {
    const db = AgriLinkBackend.getDb()
    setListings(AgriLinkBackend.searchListings())
    setBids(db.bids)
    setOrders(db.orders)
    setLabourRequests(db.labourRequests)
    setAuditLogs(AgriLinkBackend.getAuditLog())
  }

  useEffect(() => {
    refreshBackendData()
  }, [])

  useEffect(() => {
    if (currentUser) {
      setSelectedRole(currentUser.role)
    }
  }, [currentUser])

  const handleAcceptBid = (bidId: string) => {
    try {
      AgriLinkBackend.respondBid(bidId, currentUser?.id || 'usr_farmer_01', 'accept')
      setStatusMessage('Bid accepted! Quantity reserved atomically. Physical inspection scheduled.')
      refreshBackendData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleConfirmInspection = (orderId: string) => {
    try {
      AgriLinkBackend.confirmOrder(orderId, currentUser?.id || 'usr_buyer_01', 'pass')
      setStatusMessage('Inspection passed! Order confirmed and terms snapshot saved.')
      refreshBackendData()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crops', label: 'Crop discovery', icon: Wheat },
    { id: 'deals', label: 'Bids & deals', icon: Handshake },
    { id: 'labour', label: 'Labour', icon: UsersRound },
    { id: 'retail', label: 'Inventory & retail', icon: ShoppingBasket },
    { id: 'transport', label: 'Transport & delivery', icon: Truck },
    { id: 'notifications', label: 'Audit Log & alerts', icon: Bell },
    { id: 'profile', label: 'Profile & settings', icon: CircleUserRound }
  ]

  const viewNames: Record<string, string> = {
    dashboard: 'Dashboard preview',
    crops: 'Crop discovery (100 km)',
    deals: 'Bids & deals',
    labour: 'Labour coordination',
    retail: 'Inventory & retail',
    transport: 'Transport & delivery',
    notifications: 'Audit Log & notifications',
    profile: 'Profile & settings'
  }

  const roleList = Object.keys(INDIVIDUAL_PORTALS) as UserRole[]

  return (
    <div className="container demo-shell">
      {/* Top Breadcrumb & Status */}
      <div className="demo-top">
        <div className="breadcrumbs">
          <span>Home</span> &nbsp;/&nbsp;{' '}
          <strong id="breadcrumb">{viewNames[currentView] || 'Dashboard preview'}</strong>
          {currentUser && (
            <span style={{ marginLeft: 8, color: '#173f2d' }}>
              &bull; Logged in as: <strong>{currentUser.fullName}</strong>
            </span>
          )}
        </div>
        <div className="demo-label">
          <Info style={{ width: 16, height: 16 }} />
          <span>In-code Backend Active &bull; Zero external servers needed &bull; Demo data tagged</span>
        </div>
      </div>

      {statusMessage && (
        <div className="notice success" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle style={{ width: 16, height: 16 }} />
            <span>{statusMessage}</span>
          </div>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-button">
            &times;
          </button>
        </div>
      )}

      <div className="app-grid">
        {/* Responsive Mobile-Friendly Sidebar */}
        <aside className="sidebar" aria-label="Demo navigation">
          <div className="sidebar-label">EXPLORE AGRILINK</div>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = currentView === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`side-link ${active ? 'active' : ''}`}
                onClick={() => {
                  setCurrentView(item.id)
                  setStatusMessage(null)
                }}
              >
                <Icon /> {item.label}
              </button>
            )
          })}
          <div className="sidebar-foot">
            Individual Role Backend active. Permissions and state transitions run inside code.
            <button
              type="button"
              onClick={onOpenIndividualLogin}
              className="text-button"
              style={{ display: 'block', marginTop: 8 }}
            >
              Switch Role Portal &rarr;
            </button>
          </div>
        </aside>

        {/* Dynamic Main Workspace Content */}
        <section className="app-content">
          {/* View: Dashboard */}
          {currentView === 'dashboard' && (
            <>
              <div className="app-heading">
                <div>
                  <h1>A place to grow, together.</h1>
                  <p>In-code database and business logic engine running without external servers.</p>
                </div>
                <label className="role-select">
                  Preview as{' '}
                  <select
                    className="field-control"
                    id="previewRole"
                    value={selectedRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole
                      setSelectedRole(r)
                      loginIndividual(r)
                    }}
                  >
                    {roleList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="notice">
                You’re previewing the <strong>{selectedRole}</strong> experience. All listings, bids, and order snapshots persist in your browser.
              </div>

              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-top">
                    LIVE LISTINGS <Wheat style={{ width: 17, height: 17, color: '#719274' }} />
                  </div>
                  <strong>0{listings.length}</strong>
                  <small>Within 100 km radius</small>
                </div>
                <div className="stat">
                  <div className="stat-top">
                    ACTIVE BIDS <Handshake style={{ width: 17, height: 17, color: '#719274' }} />
                  </div>
                  <strong>0{bids.length}</strong>
                  <small>Highest: ₹24/kg</small>
                </div>
                <div className="stat">
                  <div className="stat-top">
                    CONFIRMED ORDERS <ClipboardList style={{ width: 17, height: 17, color: '#719274' }} />
                  </div>
                  <strong>0{orders.length}</strong>
                  <small>Terms snapshot signed</small>
                </div>
              </div>

              <div className="content-card">
                <h2>From listing to harvest support</h2>
                <p>Status transitions strictly enforced by in-code state machine:</p>
                <div className="workflow">
                  {['List crop', 'AI grade', '100km Bids', 'Inspection', 'Confirmed deal', 'Dispatch'].map((x, i) => (
                    <div key={x} className="workflow-step">
                      <span>{i + 1}</span>
                      <p>{x}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="link-arrow"
                  style={{ marginTop: 15 }}
                  onClick={() => setCurrentView('deals')}
                >
                  Explore wholesale deals <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>

              <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAiModal(true)}
                >
                  <Camera style={{ width: 16, height: 16 }} /> Launch AI Crop Scanner
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setCurrentView('transport')}
                >
                  <Truck style={{ width: 16, height: 16 }} /> 2-Opt Route Optimizer
                </button>
              </div>
            </>
          )}

          {/* View: Crops Discovery */}
          {currentView === 'crops' && (
            <>
              <div className="app-heading">
                <div>
                  <h1>Discover crops</h1>
                  <p>Real-time listings filtered within 100 km straight-line discovery radius.</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowAiModal(true)}
                >
                  <Plus style={{ width: 16, height: 16 }} /> Scan &amp; Create listing
                </button>
              </div>

              <div className="search-row">
                <input
                  className="field-control"
                  id="cropSearch"
                  type="search"
                  placeholder="Search by crop, variety or village..."
                  value={cropQuery}
                  onChange={(e) => setCropQuery(e.target.value)}
                />
                {cropQuery && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setCropQuery('')}
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="crop-grid demo-crops">
                {listings
                  .filter((l) => (l.cropName + ' ' + l.variety + ' ' + l.village).toLowerCase().includes(cropQuery.toLowerCase()))
                  .map((crop) => (
                    <article key={crop.id} className="crop-card">
                      <div className="crop-image">
                        <img
                          src={crop.cropName.includes('Tomato') ? '/crops/tomato.svg' : crop.cropName.includes('Onion') ? '/crops/onion.svg' : '/crops/potato.svg'}
                          alt={crop.cropName}
                          onError={(e) => {
                            e.currentTarget.onerror = null
                            e.currentTarget.src = '/crops/wheat.svg'
                          }}
                        />
                        <span className="sample-tag">
                          <FlaskConical style={{ width: 12, height: 12 }} /> Demo listing
                        </span>
                      </div>
                      <div className="crop-body">
                        <div className="crop-title">
                          <h3>{crop.cropName}</h3>
                          <DemoBadge isDemo={crop.isDemo} />
                        </div>
                        <div className="crop-location">
                          <MapPin style={{ width: 13, height: 13 }} /> {crop.village}, {crop.district} (approx. distance)
                        </div>
                        <div className="crop-meta">
                          <div>
                            <small>Asking price</small>
                            <strong>₹{crop.askingPricePerKg}<span> / kg</span></strong>
                          </div>
                          <div className="quantity">
                            <small>Available</small>
                            <strong>{crop.quantityKg - crop.reservedKg} kg</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-outline card-action"
                          onClick={() => {
                            const buyerName = currentUser?.fullName || 'Priya Sharma (Buyer)'
                            const bid = AgriLinkBackend.placeBid({
                              listingId: crop.id,
                              buyerId: currentUser?.id || 'usr_buyer_01',
                              buyerName,
                              buyerPhone: '+91 98901 67890',
                              pricePerKg: crop.askingPricePerKg,
                              quantityKg: Math.min(1000, crop.quantityKg - crop.reservedKg)
                            })
                            setStatusMessage(`Bid placed on ${crop.cropName} for ₹${crop.askingPricePerKg}/kg (${bid.quantityKg} kg)!`)
                            refreshBackendData()
                            setCurrentView('deals')
                          }}
                        >
                          Place bid <ArrowRight style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </>
          )}

          {/* View: Bids & Wholesale Deals */}
          {currentView === 'deals' && (
            <div className="space-y-4">
              <div className="app-heading">
                <div>
                  <h1>Bids &amp; wholesale deals</h1>
                  <p>Transparent 100 km bidding. Highest bid does not auto-win; physical inspection required.</p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="content-card" style={{ borderColor: '#cce58d', background: '#fafdf7' }}>
                  <h3 style={{ fontSize: 16, color: '#173f2d', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle style={{ width: 18, height: 18, color: '#173f2d' }} />
                    Active Confirmed Orders &amp; Inspections ({orders.length})
                  </h3>
                  {orders.map((ord) => (
                    <div key={ord.id} style={{ padding: '12px 0', borderTop: '1px solid #e2e9e0', marginTop: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>{ord.cropName} &bull; {ord.quantityKg} kg @ ₹{ord.agreedPricePerKg}/kg</strong>
                        <span className="status-pill">{ord.status}</span>
                      </div>
                      <p style={{ fontSize: 12, color: '#68786d', margin: '4px 0' }}>
                        Parties: {ord.farmerName} (Farmer) &harr; {ord.buyerName} (Buyer)
                      </p>
                      {ord.status === 'inspection_scheduled' && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ marginTop: 8, minHeight: 36, padding: '0 12px', fontSize: 12 }}
                          onClick={() => handleConfirmInspection(ord.id)}
                        >
                          Confirm Inspection &amp; Sign Terms Snapshot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="content-card">
                <h2>Incoming Bids Inbox</h2>
                <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
                  {bids.map((b) => (
                    <div
                      key={b.id}
                      style={{
                        padding: 14,
                        borderRadius: 10,
                        border: '1px solid #e2e9e0',
                        background: '#fff',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10
                      }}
                    >
                      <div>
                        <strong>{b.buyerName}</strong>
                        <span style={{ fontSize: 12, color: '#68786d', display: 'block' }}>
                          Quantity: {b.quantityKg} kg &bull; Offered: <strong>₹{b.pricePerKg}/kg</strong>
                        </span>
                        <span className="status-pill" style={{ marginTop: 4 }}>
                          Status: {b.status}
                        </span>
                      </div>

                      {b.status === 'placed' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ minHeight: 38, fontSize: 12, padding: '0 14px' }}
                            onClick={() => handleAcceptBid(b.id)}
                          >
                            Accept Bid
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ minHeight: 38, fontSize: 12, padding: '0 14px' }}
                            onClick={() => {
                              AgriLinkBackend.respondBid(b.id, currentUser?.id || 'usr_farmer_01', 'reject')
                              refreshBackendData()
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View: Labour Coordination */}
          {currentView === 'labour' && (
            <div>
              <div className="app-heading">
                <div>
                  <h1>Labour coordination</h1>
                  <p>Protected worker squads, voluntary consent rosters, 1 job per worker per day rule.</p>
                </div>
              </div>
              <div className="notice">
                Protected worker rights: Leaders never own worker identity or wages. Workers appear on rosters only after voluntary consent.
              </div>
              <div className="feature-grid">
                <div className="feature">
                  <div className="icon-box">
                    <ClipboardList style={{ width: 20, height: 20 }} />
                  </div>
                  <h3>Request harvesting labour</h3>
                  <p>Book consenting squads with fair daily wage (₹450/day).</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      AgriLinkBackend.requestLabour({
                        farmerId: currentUser?.id || 'usr_farmer_01',
                        farmerName: currentUser?.fullName || 'Ramesh Patil',
                        task: 'Tomato Picking & Sacking',
                        village: 'Dindori, Nashik',
                        workersNeeded: 6,
                        wagePerDayINR: 450
                      })
                      setStatusMessage('Labour request dispatched to Gangaram Shinde Squad (12 workers)!')
                      refreshBackendData()
                    }}
                  >
                    Post Labour Request <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                <div className="feature">
                  <div className="icon-box">
                    <UsersRound style={{ width: 20, height: 20 }} />
                  </div>
                  <h3>Mark Daily Attendance</h3>
                  <p>Enforces anti-conflict rule: one worker cannot hold two jobs on one day.</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      try {
                        AgriLinkBackend.markAttendance(
                          'assign-101',
                          'usr_worker_01',
                          'Babu Rao',
                          new Date().toISOString().split('T')[0],
                          'present',
                          'usr_leader_01'
                        )
                        setStatusMessage('Attendance marked: Babu Rao is present on job. Anti-conflict validated!')
                        refreshBackendData()
                      } catch (err: any) {
                        alert(err.message)
                      }
                    }}
                  >
                    Mark Babu Rao Present <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View: Transport & 2-Opt Route Optimization */}
          {currentView === 'transport' && (
            <div>
              <div className="app-heading">
                <div>
                  <h1>Transport &amp; delivery</h1>
                  <p>Cold fleet dispatches and 2-Opt TSP route optimization across agricultural corridors.</p>
                </div>
              </div>
              <RouteOptimizer />
            </div>
          )}

          {/* View: Retail & Inventory */}
          {currentView === 'retail' && (
            <div>
              <div className="app-heading">
                <div>
                  <h1>Inventory &amp; retail</h1>
                  <p>Vendor inventory lots with append-only movements and atomic doorstep customer ordering.</p>
                </div>
              </div>
              <div className="feature-grid">
                <div className="feature">
                  <div className="icon-box">
                    <Boxes style={{ width: 20, height: 20 }} />
                  </div>
                  <h3>Vendor Lot #881 (Tomato)</h3>
                  <p>Current balance: <strong>1,450 kg</strong> in Cold Bay A-3 (12°C).</p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      try {
                        AgriLinkBackend.placeRetailOrder(currentUser?.id || 'usr_customer_01', 'lot-881', 10)
                        setStatusMessage('Ordered 10 kg from Lot #881! Stock balance atomically updated to 1,440 kg.')
                        refreshBackendData()
                      } catch (err: any) {
                        alert(err.message)
                      }
                    }}
                  >
                    Order 10 kg as Customer <ArrowRight style={{ width: 16, height: 16 }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View: Audit Log (Hard Rule 8) */}
          {currentView === 'notifications' && (
            <div>
              <div className="app-heading">
                <div>
                  <h1>Immutable Audit Log</h1>
                  <p>Hard Rule 8: Every status change and administrative transition writes an audit entry.</p>
                </div>
              </div>
              <div className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        padding: '12px 18px',
                        borderBottom: '1px solid #edf1ea',
                        fontSize: 12
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: '#173f2d' }}>{log.action}</strong>
                        <span style={{ fontSize: 10, color: '#8b978d', fontFamily: 'monospace' }}>
                          {new Date(log.at).toLocaleTimeString()}
                        </span>
                      </div>
                      <p style={{ color: '#68786d', margin: '4px 0', fontSize: 11 }}>
                        Table: <strong>{log.tableName}</strong> &bull; Record ID: <strong>{log.recordId}</strong> &bull; Actor: <strong>{log.actorId}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* View: Profile & Settings */}
          {currentView === 'profile' && (
            <div>
              <div className="app-heading">
                <div>
                  <h1>Profile &amp; individual settings</h1>
                  <p>Your registered persona, permission scope, and verification credentials.</p>
                </div>
              </div>
              <div className="content-card">
                <h2>{currentUser?.fullName || 'Guest Explorer'}</h2>
                <p>{currentUser?.email || 'guest@agrilink.demo'}</p>
                <div className="detail-meta">
                  <div>
                    <small>Selected role</small>
                    <strong>{currentUser?.role || 'Guest'}</strong>
                  </div>
                  <div>
                    <small>Location</small>
                    <strong>{currentUser?.location || 'Nashik, Maharashtra'}</strong>
                  </div>
                  <div>
                    <small>Account access</small>
                    <strong style={{ color: '#173f2d' }}>Verified &bull; Active</strong>
                  </div>
                </div>
                <div className="notice">
                  {currentUser?.description || 'Exploring AgriLink with individual permissions.'}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onOpenIndividualLogin}
                  >
                    Switch to another Individual Role
                  </button>
                  {currentUser && (
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={logout}
                    >
                      Log out
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* AI Crop Quality Scanner Modal */}
      {showAiModal && (
        <div className="overlay" onClick={() => setShowAiModal(false)}>
          <div
            className="modal wide"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowAiModal(false)}
              aria-label="Close dialog"
            >
              <X style={{ width: 17, height: 17 }} />
            </button>
            <AiCropScanner
              onAssessmentComplete={(result) => {
                if (result.isValidCrop && result.grade) {
                  AgriLinkBackend.createListing({
                    farmerId: currentUser?.id || 'usr_farmer_01',
                    farmerName: currentUser?.fullName || 'Ramesh Patil',
                    farmerPhone: '+91 98220 12345',
                    cropName: result.crop,
                    variety: `${result.grade} Grade Harvest`,
                    quantityKg: 2000,
                    askingPricePerKg: result.crop === 'Tomato' ? 24 : result.crop === 'Onion' ? 28 : 18,
                    pickupLat: 20.201,
                    pickupLng: 73.834,
                    village: 'Dindori Taluka',
                    grade: result.grade,
                    confidence: result.confidence,
                    reasonTags: result.reasonTags
                  })
                  setStatusMessage(`Created new ${result.crop} listing with AI ${result.grade} grade (${Math.round(result.confidence * 100)}% confidence)!`)
                  refreshBackendData()
                  setShowAiModal(false)
                  setCurrentView('crops')
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
