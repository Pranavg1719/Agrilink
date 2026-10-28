import React, { useState } from 'react'
import { Building2, Package, ArrowUpRight, TrendingUp, Plus, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/common/DemoBadge'
import { useAuth } from '@/context/AuthContext'

export const VendorPage: React.FC = () => {
  const { user } = useAuth()
  const [lots, setLots] = useState([
    {
      id: 'lot-881',
      crop: 'Tomato (Hybrid Red)',
      farmerName: 'Ramesh Patil',
      sourceOrder: 'ORD-9021',
      initialQtyKg: 2000,
      currentBalanceKg: 1450,
      grade: 'Good',
      unitCostINR: 24,
      retailPriceINR: 35,
      storagePlace: 'Cold Bay A-3 (12°C)',
      status: 'active',
      isDemo: true
    },
    {
      id: 'lot-882',
      crop: 'Onion (Nashik Red)',
      farmerName: 'Suresh Patil',
      sourceOrder: 'ORD-9014',
      initialQtyKg: 4000,
      currentBalanceKg: 3800,
      grade: 'Medium',
      unitCostINR: 28,
      retailPriceINR: 42,
      storagePlace: 'Ventilated Silo B-1',
      status: 'active',
      isDemo: true
    }
  ])

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#044d37] via-[#065f46] to-[#044d37] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            🏪
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {user?.fullName || 'Gupta Fresh Produce Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              Hadapsar Wholesale Hub, Pune • FSSAI License Verified • Balance = Sum of Movements
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400 border text-xs px-3 py-1 font-bold">
          Vendor Hub (Active)
        </Badge>
      </div>

      {/* Lot Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lots.map((lot) => (
          <Card key={lot.id} className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-black text-slate-900">{lot.crop}</CardTitle>
                <span className="text-xs text-slate-500">Source: {lot.farmerName} ({lot.sourceOrder})</span>
              </div>
              <DemoBadge isDemo={lot.isDemo} />
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">In Stock</span>
                  <strong className="text-base font-black text-emerald-700">{lot.currentBalanceKg} kg</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Wholesale In</span>
                  <strong className="text-base font-black text-slate-700">₹{lot.unitCostINR}/kg</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Retail Out</span>
                  <strong className="text-base font-black text-blue-700">₹{lot.retailPriceINR}/kg</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Storage: <strong>{lot.storagePlace}</strong></span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Grade: {lot.grade}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 flex-1">
                  Publish to Retail Store
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-700 font-semibold text-xs h-10">
                  Record Spoilage/Movement
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
