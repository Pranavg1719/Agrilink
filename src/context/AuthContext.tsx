import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole =
  | 'Farmer'
  | 'Buyer / retailer'
  | 'Inventory vendor'
  | 'Customer'
  | 'Workers’ Leader'
  | 'Worker'
  | 'Transport partner'
  | 'Delivery partner'
  | 'Support operator'
  | 'Administrator'

export interface IndividualUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  phone: string
  location: string
  villageDistrict?: string
  approvalStatus: 'approved' | 'pending' | 'suspended'
  description: string
  isDemo: boolean
}

// 10 Individual Role Accounts with distinct identities and responsibilities
export const INDIVIDUAL_PORTALS: Record<UserRole, IndividualUser> = {
  'Farmer': {
    id: 'usr_farmer_01',
    email: 'ramesh.farmer@agrilink.demo',
    fullName: 'Ramesh Patil (रमेश पाटील)',
    role: 'Farmer',
    phone: '+91 98220 12345',
    location: 'Dindori Taluka, Nashik',
    villageDistrict: 'Dindori Taluka, Nashik',
    approvalStatus: 'approved',
    description: 'Grower of Tomatoes & Onions. Direct DBT bank linked.',
    isDemo: true
  },
  'Buyer / retailer': {
    id: 'usr_buyer_01',
    email: 'priya.buyer@agrilink.demo',
    fullName: 'Priya Sharma (प्रिया शर्मा)',
    role: 'Buyer / retailer',
    phone: '+91 98901 67890',
    location: 'Vashi APMC, Navi Mumbai',
    villageDistrict: 'Vashi APMC, Navi Mumbai',
    approvalStatus: 'approved',
    description: 'Licensed wholesale procurement merchant.',
    isDemo: true
  },
  'Inventory vendor': {
    id: 'usr_vendor_01',
    email: 'gupta.vendor@agrilink.demo',
    fullName: 'Gupta Fresh Produce Hub',
    role: 'Inventory vendor',
    phone: '+91 93700 11223',
    location: 'Hadapsar Wholesale Hub, Pune',
    villageDistrict: 'Hadapsar Wholesale Hub, Pune',
    approvalStatus: 'approved',
    description: 'Cold storage warehouse operator & retail supplier.',
    isDemo: true
  },
  'Customer': {
    id: 'usr_customer_01',
    email: 'ananya.customer@agrilink.demo',
    fullName: 'Ananya Deshmukh (ग्राहक)',
    role: 'Customer',
    phone: '+91 90111 22334',
    location: 'Aundh, Pune',
    villageDistrict: 'Aundh, Pune',
    approvalStatus: 'approved',
    description: 'Household consumer ordering direct farm fresh produce.',
    isDemo: true
  },
  'Workers’ Leader': {
    id: 'usr_leader_01',
    email: 'gangaram.leader@agrilink.demo',
    fullName: 'Gangaram Shinde (मजदूर मुकादम)',
    role: 'Workers’ Leader',
    phone: '+91 97654 44321',
    location: 'Niphad, Nashik',
    villageDistrict: 'Niphad, Nashik',
    approvalStatus: 'approved',
    description: 'Leader of 12 registered harvest workers.',
    isDemo: true
  },
  'Worker': {
    id: 'usr_worker_01',
    email: 'babu.worker@agrilink.demo',
    fullName: 'Babu Rao (कृषि श्रमिक)',
    role: 'Worker',
    phone: '+91 95432 10987',
    location: 'Dindori, Nashik',
    villageDistrict: 'Dindori, Nashik',
    approvalStatus: 'approved',
    description: 'Harvesting & sorting worker with voluntary consent.',
    isDemo: true
  },
  'Transport partner': {
    id: 'usr_transport_01',
    email: 'santosh.transport@agrilink.demo',
    fullName: 'Santosh Jadhav (KrishiRath Cold Fleet)',
    role: 'Transport partner',
    phone: '+91 94222 88990',
    location: 'Bhosari MIDC, Pune',
    villageDistrict: 'Bhosari MIDC, Pune',
    approvalStatus: 'approved',
    description: '14ft insulated refrigerated vehicle operator (MH-15-EG-4412).',
    isDemo: true
  },
  'Delivery partner': {
    id: 'usr_delivery_01',
    email: 'kailash.delivery@agrilink.demo',
    fullName: 'Kailash Salunkhe (Doorstep Van)',
    role: 'Delivery partner',
    phone: '+91 91234 56789',
    location: 'Kothrud, Pune',
    villageDistrict: 'Kothrud, Pune',
    approvalStatus: 'approved',
    description: 'Last-mile 2-hour slot delivery partner.',
    isDemo: true
  },
  'Support operator': {
    id: 'usr_support_01',
    email: 'kavita.support@agrilink.demo',
    fullName: 'Kavita Joshi (AgriLink Support)',
    role: 'Support operator',
    phone: '+91 80000 11111',
    location: 'State Helpdesk, Maharashtra',
    villageDistrict: 'State Helpdesk, Maharashtra',
    approvalStatus: 'approved',
    description: 'Dispute reviewer & quality arbitration desk.',
    isDemo: true
  },
  'Administrator': {
    id: 'usr_admin_01',
    email: 'admin.vikram@agrilink.demo',
    fullName: 'Dr. Vikram More (Directorate of Agriculture)',
    role: 'Administrator',
    phone: '+91 88888 99999',
    location: 'Pune Directorate HQ',
    villageDistrict: 'Pune Directorate HQ',
    approvalStatus: 'approved',
    description: 'System auditor & partner approval authority.',
    isDemo: true
  }
}

interface AuthContextType {
  currentUser: IndividualUser | null
  user: IndividualUser | null // alias
  loginIndividual: (role: UserRole) => void
  loginAsRole: (role: UserRole) => void // alias
  customLogin: (email: string, role: UserRole, fullName: string) => void
  logout: () => void
  portals: typeof INDIVIDUAL_PORTALS
  allDemoUsers: typeof INDIVIDUAL_PORTALS // alias
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<IndividualUser | null>(() => {
    const saved = localStorage.getItem('agrilink_individual_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return null
      }
    }
    return null
  })

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('agrilink_individual_user', JSON.stringify(currentUser))
    } else {
      localStorage.removeItem('agrilink_individual_user')
    }
  }, [currentUser])

  const loginIndividual = (role: UserRole) => {
    const portal = INDIVIDUAL_PORTALS[role]
    if (portal) {
      setCurrentUser(portal)
    }
  }

  const customLogin = (email: string, role: UserRole, fullName: string) => {
    const newUser: IndividualUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      fullName,
      role,
      phone: '+91 90000 00000',
      location: 'Maharashtra Grid',
      villageDistrict: 'Maharashtra Grid',
      approvalStatus: ['Workers’ Leader', 'Inventory vendor', 'Transport partner', 'Delivery partner'].includes(role)
        ? 'pending'
        : 'approved',
      description: 'Individual registered account.',
      isDemo: false
    }
    setCurrentUser(newUser)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser,
        loginIndividual,
        loginAsRole: loginIndividual,
        customLogin,
        logout,
        portals: INDIVIDUAL_PORTALS,
        allDemoUsers: INDIVIDUAL_PORTALS
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
