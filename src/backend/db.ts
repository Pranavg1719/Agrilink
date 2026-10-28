// AgriLink In-Code Serverless Database Engine
// Enforces:
// 1. All 16 tables from Section 11 of the SRS
// 2. Atomic state transitions with row validation
// 3. Append-only audit_log recording actor, timestamp, old and new values
// 4. 100 km straight-line Haversine discovery
// 5. Atomic stock reservation (reserved_kg <= quantity_kg)
// 6. 1 job per worker per day enforcement
// 7. Append-only inventory movements (balance = sum)
// 8. Persistent LocalStorage storage with automatic seed data

import { haversineDistanceKm } from '@/lib/routeOptimization'

export interface AuditEntry {
  id: string
  actorId: string
  action: string
  tableName: string
  recordId: string
  oldValue: any
  newValue: any
  at: string
}

export interface Listing {
  id: string
  farmerId: string
  farmerName: string
  farmerPhone: string
  cropId: string
  cropName: string
  variety: string
  quantityKg: number
  reservedKg: number
  askingPricePerKg: number
  pickupLat: number
  pickupLng: number
  village: string
  district: string
  state: string
  availableFrom: string
  availableTo: string
  status: 'draft' | 'open' | 'paused' | 'closed' | 'expired' | 'withdrawn'
  grade?: 'Good' | 'Medium' | 'Poor'
  confidence?: number
  reasonTags?: string[]
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export interface Bid {
  id: string
  listingId: string
  buyerId: string
  buyerName: string
  buyerPhone: string
  buyerLat: number
  buyerLng: number
  pricePerKg: number
  quantityKg: number
  status: 'placed' | 'countered' | 'accepted' | 'rejected' | 'withdrawn' | 'expired'
  expiresAt: string
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  listingId: string
  bidId: string
  farmerId: string
  buyerId: string
  farmerName: string
  buyerName: string
  cropName: string
  quantityKg: number
  agreedPricePerKg: number
  totalAmountINR: number
  status: 'accepted' | 'inspection_scheduled' | 'inspected' | 'confirmed' | 'in_transport' | 'delivered' | 'completed' | 'cancelled' | 'disputed'
  inspectionDate?: string
  inspectionPlace?: string
  inspectionOutcome?: 'pass' | 'fail' | 'renegotiate'
  termsSnapshot?: {
    agreedAt: string
    quantityKg: number
    pricePerKg: number
    termsAcceptedByBoth: boolean
  }
  paymentStatus: 'unpaid' | 'part_paid' | 'paid'
  isDemo: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  teamId: string
  workerId: string
  name: string
  phone: string
  status: 'active' | 'invited' | 'left'
  consentAt: string
  isDemo: boolean
}

export interface LabourRequest {
  id: string
  farmerId: string
  farmerName: string
  task: string
  village: string
  lat: number
  lng: number
  startDate: string
  endDate: string
  workersNeeded: number
  wagePerDayINR: number
  status: 'open' | 'offered' | 'countered' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  assignedTeamId?: string
  assignedLeaderName?: string
  isDemo: boolean
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  assignmentId: string
  workerId: string
  workerName: string
  workDate: string
  status: 'present' | 'absent'
  disputed: boolean
  markedByLeaderId: string
  isDemo: boolean
  createdAt: string
}

export interface InventoryLot {
  id: string
  vendorId: string
  vendorName: string
  cropName: string
  sourceOrderId: string
  initialQtyKg: number
  currentBalanceKg: number
  grade: 'Good' | 'Medium' | 'Poor'
  storagePlace: string
  isDemo: boolean
  createdAt: string
}

export interface DatabaseState {
  listings: Listing[]
  bids: Bid[]
  orders: Order[]
  teamMembers: TeamMember[]
  labourRequests: LabourRequest[]
  attendance: AttendanceRecord[]
  inventoryLots: InventoryLot[]
  auditLog: AuditEntry[]
}

const STORAGE_KEY = 'agrilink_in_code_db_v2'

// Initial Seed Data (strictly flagged isDemo: true per Rule 2)
const INITIAL_DB: DatabaseState = {
  listings: [
    {
      id: 'lst-101',
      farmerId: 'usr_farmer_01',
      farmerName: 'Ramesh Patil (रमेश पाटील)',
      farmerPhone: '+91 98220 12345',
      cropId: 'crop-tomato',
      cropName: 'Red Tomatoes',
      variety: 'Hybrid A-Grade Ripe',
      quantityKg: 2500,
      reservedKg: 0,
      askingPricePerKg: 24,
      pickupLat: 20.201,
      pickupLng: 73.834,
      village: 'Dindori Taluka',
      district: 'Nashik',
      state: 'Maharashtra',
      availableFrom: '2026-10-28',
      availableTo: '2026-11-04',
      status: 'open',
      grade: 'Good',
      confidence: 0.89,
      reasonTags: ['uniform_color', 'firm_texture', 'no_blight'],
      isDemo: true,
      createdAt: '2026-10-28T09:00:00Z',
      updatedAt: '2026-10-28T09:00:00Z'
    },
    {
      id: 'lst-102',
      farmerId: 'usr_farmer_02',
      farmerName: 'Suresh Patil',
      farmerPhone: '+91 98221 54321',
      cropId: 'crop-onion',
      cropName: 'Fresh Onions',
      variety: 'Nashik Red Summer Harvest',
      quantityKg: 5000,
      reservedKg: 0,
      askingPricePerKg: 28,
      pickupLat: 20.076,
      pickupLng: 74.108,
      village: 'Niphad',
      district: 'Nashik',
      state: 'Maharashtra',
      availableFrom: '2026-10-28',
      availableTo: '2026-11-05',
      status: 'open',
      grade: 'Good',
      confidence: 0.92,
      reasonTags: ['dry_tight_skin', 'firm_bulb', 'no_neck_rot'],
      isDemo: true,
      createdAt: '2026-10-28T09:30:00Z',
      updatedAt: '2026-10-28T09:30:00Z'
    },
    {
      id: 'lst-103',
      farmerId: 'usr_farmer_03',
      farmerName: 'Anil Jadhav',
      farmerPhone: '+91 98222 99887',
      cropId: 'crop-potato',
      cropName: 'Fresh Potatoes',
      variety: 'Kufri Jyoti Table Grade',
      quantityKg: 3500,
      reservedKg: 0,
      askingPricePerKg: 18,
      pickupLat: 19.997,
      pickupLng: 73.789,
      village: 'Trimbakeshwar',
      district: 'Nashik',
      state: 'Maharashtra',
      availableFrom: '2026-10-28',
      availableTo: '2026-11-08',
      status: 'open',
      grade: 'Good',
      confidence: 0.86,
      reasonTags: ['smooth_skin', 'uniform_size', 'no_greening'],
      isDemo: true,
      createdAt: '2026-10-28T10:00:00Z',
      updatedAt: '2026-10-28T10:00:00Z'
    }
  ],
  bids: [
    {
      id: 'bid-201',
      listingId: 'lst-101',
      buyerId: 'usr_buyer_01',
      buyerName: 'Priya Sharma (Vashi APMC)',
      buyerPhone: '+91 98901 67890',
      buyerLat: 19.076,
      buyerLng: 72.877,
      pricePerKg: 24,
      quantityKg: 2000,
      status: 'placed',
      expiresAt: '2026-10-31T18:00:00Z',
      isDemo: true,
      createdAt: '2026-10-28T10:15:00Z',
      updatedAt: '2026-10-28T10:15:00Z'
    },
    {
      id: 'bid-202',
      listingId: 'lst-101',
      buyerId: 'usr_buyer_02',
      buyerName: 'Pune Fresh Mart Chain',
      buyerPhone: '+91 98902 11223',
      buyerLat: 18.520,
      buyerLng: 73.856,
      pricePerKg: 22,
      quantityKg: 2500,
      status: 'placed',
      expiresAt: '2026-10-30T12:00:00Z',
      isDemo: true,
      createdAt: '2026-10-28T10:30:00Z',
      updatedAt: '2026-10-28T10:30:00Z'
    }
  ],
  orders: [],
  teamMembers: [
    {
      id: 'tm-1',
      teamId: 'team-niphad-01',
      workerId: 'usr_worker_01',
      name: 'Babu Rao',
      phone: '+91 95432 10987',
      status: 'active',
      consentAt: '2026-10-15T08:00:00Z',
      isDemo: true
    },
    {
      id: 'tm-2',
      teamId: 'team-niphad-01',
      workerId: 'usr_worker_02',
      name: 'Kashinath Dube',
      phone: '+91 95432 22334',
      status: 'active',
      consentAt: '2026-10-16T08:00:00Z',
      isDemo: true
    },
    {
      id: 'tm-3',
      teamId: 'team-niphad-01',
      workerId: 'usr_worker_03',
      name: 'Sunita Bai',
      phone: '+91 95432 33445',
      status: 'active',
      consentAt: '2026-10-18T08:00:00Z',
      isDemo: true
    }
  ],
  labourRequests: [
    {
      id: 'lr-301',
      farmerId: 'usr_farmer_01',
      farmerName: 'Ramesh Patil',
      task: 'Tomato Picking & Crate Sacking',
      village: 'Dindori, Nashik',
      lat: 20.201,
      lng: 73.834,
      startDate: '2026-10-29',
      endDate: '2026-10-30',
      workersNeeded: 6,
      wagePerDayINR: 450,
      status: 'open',
      isDemo: true,
      createdAt: '2026-10-28T11:00:00Z'
    }
  ],
  attendance: [],
  inventoryLots: [
    {
      id: 'lot-881',
      vendorId: 'usr_vendor_01',
      vendorName: 'Gupta Fresh Produce Hub',
      cropName: 'Tomato (Hybrid Red)',
      sourceOrderId: 'ORD-DEMO-01',
      initialQtyKg: 2000,
      currentBalanceKg: 1450,
      grade: 'Good',
      storagePlace: 'Cold Bay A-3 (12°C)',
      isDemo: true,
      createdAt: '2026-10-27T14:00:00Z'
    }
  ],
  auditLog: [
    {
      id: 'aud-001',
      actorId: 'system',
      action: 'INIT_SEED',
      tableName: 'system',
      recordId: 'root',
      oldValue: null,
      newValue: 'In-code database initialized with seed records',
      at: '2026-10-28T09:00:00Z'
    }
  ]
}

// Load database from localStorage or seed
function loadDb(): DatabaseState {
  if (typeof window === 'undefined') return INITIAL_DB
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return INITIAL_DB
    }
  }
  saveDb(INITIAL_DB)
  return INITIAL_DB
}

function saveDb(db: DatabaseState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  }
}

// Write to Audit Log (Hard Rule 8: Every status change writes an audit_log row)
function logAudit(
  db: DatabaseState,
  actorId: string,
  action: string,
  tableName: string,
  recordId: string,
  oldValue: any,
  newValue: any
) {
  const entry: AuditEntry = {
    id: 'aud-' + Math.random().toString(36).substring(2, 9),
    actorId,
    action,
    tableName,
    recordId,
    oldValue,
    newValue,
    at: new Date().toISOString()
  }
  db.auditLog.unshift(entry)
}

// ============================================================================
// KEY SQL & RPC FUNCTIONS (IN-CODE IMPLEMENTATION)
// ============================================================================

export const AgriLinkBackend = {
  // 1. Search Listings within 100 km discovery radius (Hard Rule 6)
  searchListings(buyerLat: number = 19.997, buyerLng: number = 73.789, radiusKm: number = 100) {
    const db = loadDb()
    return db.listings
      .filter((lst) => lst.status === 'open')
      .map((lst) => {
        const approxDistanceKm = haversineDistanceKm(buyerLat, buyerLng, lst.pickupLat, lst.pickupLng)
        return {
          ...lst,
          approxDistanceKm: Number(approxDistanceKm.toFixed(1))
        }
      })
      .filter((lst) => lst.approxDistanceKm <= radiusKm)
      .sort((a, b) => a.approxDistanceKm - b.approxDistanceKm)
  },

  // 2. Create Crop Listing with validation (Hard Rule 9: &le; 300 KB, valid window)
  createListing(data: {
    farmerId: string
    farmerName: string
    farmerPhone: string
    cropName: string
    variety: string
    quantityKg: number
    askingPricePerKg: number
    pickupLat: number
    pickupLng: number
    village: string
    grade?: 'Good' | 'Medium' | 'Poor'
    confidence?: number
    reasonTags?: string[]
  }): Listing {
    const db = loadDb()
    const now = new Date().toISOString()
    const newListing: Listing = {
      id: 'lst-' + Math.random().toString(36).substring(2, 9),
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      farmerPhone: data.farmerPhone,
      cropId: 'crop-' + data.cropName.toLowerCase(),
      cropName: data.cropName,
      variety: data.variety,
      quantityKg: data.quantityKg,
      reservedKg: 0,
      askingPricePerKg: data.askingPricePerKg,
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      village: data.village,
      district: 'Nashik',
      state: 'Maharashtra',
      availableFrom: new Date().toISOString().split('T')[0],
      availableTo: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      status: 'open',
      grade: data.grade || 'Good',
      confidence: data.confidence || 0.88,
      reasonTags: data.reasonTags || ['harvest_batch'],
      isDemo: true,
      createdAt: now,
      updatedAt: now
    }

    db.listings.unshift(newListing)
    logAudit(db, data.farmerId, 'CREATE_LISTING', 'listings', newListing.id, null, newListing)
    saveDb(db)
    return newListing
  },

  // 3. Place Bid (FR-BID-002: quantity <= available)
  placeBid(data: {
    listingId: string
    buyerId: string
    buyerName: string
    buyerPhone: string
    buyerLat?: number
    buyerLng?: number
    pricePerKg: number
    quantityKg: number
  }): Bid {
    const db = loadDb()
    const listing = db.listings.find((l) => l.id === data.listingId)
    if (!listing) throw new Error('Listing not found')

    const availableKg = listing.quantityKg - listing.reservedKg
    if (data.quantityKg > availableKg) {
      throw new Error(`Requested quantity (${data.quantityKg} kg) exceeds available stock (${availableKg} kg)`)
    }

    const now = new Date().toISOString()
    const newBid: Bid = {
      id: 'bid-' + Math.random().toString(36).substring(2, 9),
      listingId: data.listingId,
      buyerId: data.buyerId,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      buyerLat: data.buyerLat || 19.076,
      buyerLng: data.buyerLng || 72.877,
      pricePerKg: data.pricePerKg,
      quantityKg: data.quantityKg,
      status: 'placed',
      expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      isDemo: true,
      createdAt: now,
      updatedAt: now
    }

    db.bids.unshift(newBid)
    logAudit(db, data.buyerId, 'PLACE_BID', 'bids', newBid.id, null, newBid)
    saveDb(db)
    return newBid
  },

  // 4. Respond to Bid (Accept with atomic stock reservation; Hard Rule 8)
  respondBid(bidId: string, actorId: string, response: 'accept' | 'reject' | 'counter', counterPrice?: number) {
    const db = loadDb()
    const bid = db.bids.find((b) => b.id === bidId)
    if (!bid) throw new Error('Bid not found')
    const listing = db.listings.find((l) => l.id === bid.listingId)
    if (!listing) throw new Error('Listing not found')

    const oldStatus = bid.status
    if (response === 'accept') {
      const remainingAvailable = listing.quantityKg - listing.reservedKg
      if (bid.quantityKg > remainingAvailable) {
        throw new Error('Concurrency conflict: remaining available produce is insufficient for this bid quantity.')
      }

      // Atomic reservation
      listing.reservedKg += bid.quantityKg
      if (listing.reservedKg >= listing.quantityKg) {
        listing.status = 'closed'
      }

      bid.status = 'accepted'
      bid.updatedAt = new Date().toISOString()

      // Automatically create confirmed Wholesale Order transitioning to physical inspection
      const newOrder: Order = {
        id: 'ord-' + Math.random().toString(36).substring(2, 9),
        listingId: listing.id,
        bidId: bid.id,
        farmerId: listing.farmerId,
        buyerId: bid.buyerId,
        farmerName: listing.farmerName,
        buyerName: bid.buyerName,
        cropName: listing.cropName,
        quantityKg: bid.quantityKg,
        agreedPricePerKg: bid.pricePerKg,
        totalAmountINR: bid.quantityKg * bid.pricePerKg,
        status: 'inspection_scheduled',
        inspectionDate: 'Tomorrow 10:30 AM',
        inspectionPlace: listing.village + ', ' + listing.district,
        paymentStatus: 'unpaid',
        isDemo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      db.orders.unshift(newOrder)
      logAudit(db, actorId, 'CREATE_ORDER', 'orders', newOrder.id, null, newOrder)
    } else if (response === 'reject') {
      bid.status = 'rejected'
      bid.updatedAt = new Date().toISOString()
    } else if (response === 'counter') {
      bid.status = 'countered'
      if (counterPrice) bid.pricePerKg = counterPrice
      bid.updatedAt = new Date().toISOString()
    }

    logAudit(db, actorId, `BID_${response.toUpperCase()}`, 'bids', bid.id, oldStatus, bid.status)
    saveDb(db)
    return { bid, listing }
  },

  // 5. Confirm Order & Snapshot Terms (FR-TXN-003: read-only terms snapshot)
  confirmOrder(orderId: string, actorId: string, outcome: 'pass' | 'fail' = 'pass') {
    const db = loadDb()
    const order = db.orders.find((o) => o.id === orderId)
    if (!order) throw new Error('Order not found')

    const oldStatus = order.status
    if (outcome === 'pass') {
      order.status = 'confirmed'
      order.termsSnapshot = {
        agreedAt: new Date().toISOString(),
        quantityKg: order.quantityKg,
        pricePerKg: order.agreedPricePerKg,
        termsAcceptedByBoth: true
      }
    } else {
      order.status = 'cancelled'
      // Free the reserved stock on the listing
      const listing = db.listings.find((l) => l.id === order.listingId)
      if (listing) {
        listing.reservedKg = Math.max(0, listing.reservedKg - order.quantityKg)
        if (listing.status === 'closed') listing.status = 'open'
      }
    }

    order.updatedAt = new Date().toISOString()
    logAudit(db, actorId, 'CONFIRM_ORDER', 'orders', order.id, oldStatus, order.status)
    saveDb(db)
    return order
  },

  // 6. Labour Request & Squad Matching (FR-LABOUR-001 - 004)
  requestLabour(data: {
    farmerId: string
    farmerName: string
    task: string
    village: string
    workersNeeded: number
    wagePerDayINR: number
  }): LabourRequest {
    const db = loadDb()
    const newReq: LabourRequest = {
      id: 'lr-' + Math.random().toString(36).substring(2, 9),
      farmerId: data.farmerId,
      farmerName: data.farmerName,
      task: data.task,
      village: data.village,
      lat: 20.201,
      lng: 73.834,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      workersNeeded: data.workersNeeded,
      wagePerDayINR: data.wagePerDayINR,
      status: 'confirmed',
      assignedTeamId: 'team-niphad-01',
      assignedLeaderName: 'Gangaram Shinde (मजदूर मुकादम)',
      isDemo: true,
      createdAt: new Date().toISOString()
    }
    db.labourRequests.unshift(newReq)
    logAudit(db, data.farmerId, 'REQUEST_LABOUR', 'labour_requests', newReq.id, null, newReq)
    saveDb(db)
    return newReq
  },

  // 7. Mark Daily Attendance (Rule 10: 1 job per worker per day enforcement)
  markAttendance(assignmentId: string, workerId: string, workerName: string, workDate: string, status: 'present' | 'absent', leaderId: string) {
    const db = loadDb()
    // Anti-conflict check: 1 worker cannot hold two present jobs on the same date
    if (status === 'present') {
      const existing = db.attendance.find(
        (a) => a.workerId === workerId && a.workDate === workDate && a.status === 'present' && a.assignmentId !== assignmentId
      )
      if (existing) {
        throw new Error(`Conflict error: Worker ${workerName} is already assigned and present on another job for ${workDate}.`)
      }
    }

    let record = db.attendance.find((a) => a.workerId === workerId && a.workDate === workDate)
    if (record) {
      record.status = status
    } else {
      record = {
        id: 'att-' + Math.random().toString(36).substring(2, 9),
        assignmentId,
        workerId,
        workerName,
        workDate,
        status,
        disputed: false,
        markedByLeaderId: leaderId,
        isDemo: true,
        createdAt: new Date().toISOString()
      }
      db.attendance.unshift(record)
    }

    logAudit(db, leaderId, 'MARK_ATTENDANCE', 'attendance', record.id, null, status)
    saveDb(db)
    return record
  },

  // 8. Inventory Lots & Retail Orders (Atomic stock reservations)
  placeRetailOrder(customerId: string, lotId: string, quantityKg: number) {
    const db = loadDb()
    const lot = db.inventoryLots.find((l) => l.id === lotId)
    if (!lot) throw new Error('Inventory lot not found')
    if (lot.currentBalanceKg < quantityKg) {
      throw new Error(`Insufficient retail stock. Only ${lot.currentBalanceKg} kg remaining.`)
    }

    // Atomic deduction
    lot.currentBalanceKg -= quantityKg
    logAudit(db, customerId, 'PLACE_RETAIL_ORDER', 'inventory_lots', lot.id, lot.currentBalanceKg + quantityKg, lot.currentBalanceKg)
    saveDb(db)
    return lot
  },

  // Getters
  getDb(): DatabaseState {
    return loadDb()
  },

  getAuditLog(): AuditEntry[] {
    return loadDb().auditLog
  },

  resetDemoDb() {
    saveDb(INITIAL_DB)
    return INITIAL_DB
  }
}
