import React, { useState } from 'react'
import { ShoppingBag, CheckCircle2, MapPin, Truck, Plus, Minus, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/common/DemoBadge'
import { useAuth } from '@/context/AuthContext'

export const ConsumerStorePage: React.FC = () => {
  const { user } = useAuth()
  const [cart, setCart] = useState<{ [id: string]: number }>({ 'prod-1': 2 })
  const [orderConfirmed, setOrderConfirmed] = useState(false)

  const products = [
    {
      id: 'prod-1',
      name: 'Farm Fresh Tomatoes (A-Grade Hybrid)',
      vendor: 'Gupta Fresh Produce Hub',
      priceINR: 35,
      unit: 'kg',
      image: '🍅',
      inStockKg: 240,
      isDemo: true
    },
    {
      id: 'prod-2',
      name: 'Nashik Premium Red Onions',
      vendor: 'Gupta Fresh Produce Hub',
      priceINR: 42,
      unit: 'kg',
      image: '🧅',
      inStockKg: 500,
      isDemo: true
    },
    {
      id: 'prod-3',
      name: 'Fresh Harvest Potatoes (Kufri Jyoti)',
      vendor: 'Sahyadri Agri Hub',
      priceINR: 28,
      unit: 'kg',
      image: '🥔',
      inStockKg: 350,
      isDemo: true
    }
  ]

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const prod = products.find(p => p.id === id)
    return sum + (prod ? prod.priceINR * qty : 0)
  }, 0)

  const handlePlaceOrder = () => {
    setOrderConfirmed(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#044d37] via-[#065f46] to-[#044d37] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            🛒
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              AgriLink Consumer Fresh Store
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              Direct from verified vendor lots • 2-Hour Slot Doorstep Delivery • Zero Middlemen Markups
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400 border text-xs px-3 py-1 font-bold">
          Consumer Pipeline
        </Badge>
      </div>

      {orderConfirmed && (
        <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-4 animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5">
            <strong className="text-base font-black block">Order Confirmed! Assigned to Delivery Fleet</strong>
            <p>
              Stock of {Object.values(cart).reduce((a, b) => a + b, 0)} kg has been atomically reserved from Gupta Fresh Produce Hub.
            </p>
            <p className="text-emerald-800 font-semibold">
              Delivery Partner: Kailash Salunkhe (Slot: 1:00 PM – 3:00 PM) &bull; Live status updates on your portal.
            </p>
          </div>
        </div>
      )}

      {/* Produce Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((p) => {
          const qty = cart[p.id] || 0
          return (
            <Card key={p.id} className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl">
                    {p.image}
                  </div>
                  <DemoBadge isDemo={p.isDemo} />
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Vendor: {p.vendor}</p>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <span className="text-2xl font-black text-slate-900">₹{p.priceINR}</span>
                    <span className="text-xs text-slate-500"> / {p.unit}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {p.inStockKg} kg stock
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCart({ ...cart, [p.id]: Math.max(0, qty - 1) })}
                      className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{qty} kg</span>
                    <button
                      onClick={() => setCart({ ...cart, [p.id]: qty + 1 })}
                      className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-bold text-slate-900">
                    ₹{qty * p.priceINR}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Cart Summary & Order Placement */}
      {totalAmount > 0 && !orderConfirmed && (
        <Card className="border-2 border-emerald-600 bg-emerald-50/50 shadow-md">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Delivery Address: {user?.villageDistrict || 'Aundh, Pune'}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  Total: ₹{totalAmount.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  (Includes ₹0 doorstep handling in pilot)
                </span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm h-12 px-8 shadow-sm flex items-center gap-2"
            >
              <span>Place Doorstep Order</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
