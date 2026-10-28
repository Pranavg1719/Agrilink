import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { DemoBadge } from '@/components/common/DemoBadge'
import { AiDisclaimer } from '@/components/common/AiDisclaimer'
import { MapPin, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const ListingsPage: React.FC = () => {
  // Sample demonstration crop cards to test UI scaffolding
  const demoListings = [
    {
      id: 'demo-1',
      crop: 'Tomato (Hybrid Red)',
      farmer: 'Ramesh Patel',
      village: 'Nashik, Maharashtra',
      distance_km: 24,
      quantity_kg: 2500,
      asking_price: 22,
      grade: 'Good' as const,
      confidence: 0.88,
      reason_tags: ['uniform_color', 'firm_texture', 'no_blemish'],
      is_demo: true
    },
    {
      id: 'demo-2',
      crop: 'Onion (Nashik Red)',
      farmer: 'Suresh Patil',
      village: 'Dindori, Maharashtra',
      distance_km: 48,
      quantity_kg: 5000,
      asking_price: 28,
      grade: 'Medium' as const,
      confidence: 0.74,
      reason_tags: ['slight_sprouting', 'sound_dry_skin'],
      is_demo: true
    },
    {
      id: 'demo-3',
      crop: 'Potato (Kufri Jyoti)',
      farmer: 'Anil Jadhav',
      village: 'Niphad, Maharashtra',
      distance_km: 72,
      quantity_kg: 8000,
      asking_price: 18,
      grade: 'Good' as const,
      confidence: 0.91,
      reason_tags: ['uniform_size', 'no_green_greening', 'dry_skin'],
      is_demo: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <span>Produce Listings (Wholesale)</span>
          </h1>
          <p className="text-sm text-slate-500">
            Filtered within 100 km discovery radius (straight-line approx. distance).
          </p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/listings/new">+ New Crop Listing</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {demoListings.map(item => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <DemoBadge isDemo={item.is_demo} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  ~{item.distance_km} km (approx. distance)
                </span>
              </div>
              <CardTitle className="text-lg mt-2 text-slate-900">{item.crop}</CardTitle>
              <p className="text-xs text-slate-500 font-medium">Farmer: {item.farmer} • {item.village}</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-500 block">Available Quantity</span>
                  <span className="font-bold text-slate-900 text-sm">{item.quantity_kg.toLocaleString()} kg</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Asking Price</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{item.asking_price}/kg</span>
                </div>
              </div>

              <AiDisclaimer 
                grade={item.grade}
                confidence={item.confidence}
                reasonTags={item.reason_tags}
              />

              <Button asChild variant="outline" className="w-full text-xs font-semibold">
                <Link to="/bids">Place Bid / View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
