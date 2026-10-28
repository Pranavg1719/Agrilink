import React, { useState } from 'react'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { 
  Users, 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Sprout, 
  Truck, 
  Store, 
  UserCheck, 
  Headphones, 
  ShoppingBag
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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

export const RolePortalSwitcher: React.FC = () => {
  const { user, loginAsRole, allDemoUsers } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null
  const CurrentIcon = ROLE_ICONS[user.role] || Users

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all shadow-xs min-h-[36px]"
        title="Switch portal role instantly"
      >
        <CurrentIcon className="w-4 h-4 text-emerald-300" />
        <span className="hidden sm:inline font-semibold">{user.fullName}</span>
        <Badge className="bg-emerald-500/30 text-emerald-200 border-emerald-400/30 text-[10px] uppercase font-mono">
          {user.role}
        </Badge>
        <ChevronDown className="w-3.5 h-3.5 text-white/70" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Switch Role Portal</p>
              <p className="text-[10px] text-slate-500">1-click individual login</p>
            </div>
            <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-900 border-amber-200">
              Individual
            </Badge>
          </div>

          <div className="max-h-80 overflow-y-auto py-1 space-y-1">
            {(Object.keys(allDemoUsers) as UserRole[]).map((r) => {
              const persona = allDemoUsers[r]
              const Icon = ROLE_ICONS[r]
              const isSelected = user.role === r

              return (
                <button
                  key={r}
                  onClick={() => {
                    loginAsRole(r)
                    setOpen(false)
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                    isSelected ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="leading-tight font-semibold truncate">{persona.fullName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{r} • {persona.location}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
