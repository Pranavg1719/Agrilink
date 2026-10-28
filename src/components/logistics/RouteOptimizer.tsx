import React, { useState } from 'react'
import { 
  Truck, 
  MapPin, 
  Sparkles, 
  TrendingDown, 
  Fuel, 
  Leaf, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2,
  ArrowRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  optimizeLogisticsRoute, 
  type Waypoint, 
  type RouteOptimizationResult 
} from '@/lib/routeOptimization'

// Regional Agricultural Hubs in the Western Maharashtra / Nashik-Pune-Mumbai corridor
const DEFAULT_WAYPOINTS: Waypoint[] = [
  {
    id: 'depot-0',
    name: 'KrishiRath Cold Fleet Hub (Depot)',
    address: 'Bhosari MIDC, Pune',
    lat: 18.627,
    lng: 73.844,
    type: 'depot',
    quantityKg: 0,
    timeWindow: '06:00 AM'
  },
  {
    id: 'stop-3',
    name: 'Niphad Onion Mandi & Aggregation Hub',
    address: 'Niphad, Nashik',
    lat: 20.076,
    lng: 74.108,
    type: 'pickup',
    quantityKg: 2500,
    timeWindow: '08:30 AM'
  },
  {
    id: 'stop-1',
    name: 'Ramesh Patil Farm Gate (Tomato)',
    address: 'Dindori Taluka, Nashik',
    lat: 20.201,
    lng: 73.834,
    type: 'pickup',
    quantityKg: 1800,
    timeWindow: '09:45 AM'
  },
  {
    id: 'stop-2',
    name: 'Suresh Patil Farm Gate (Onion)',
    address: 'Girna Valley, Nashik',
    lat: 20.125,
    lng: 73.952,
    type: 'pickup',
    quantityKg: 1400,
    timeWindow: '10:30 AM'
  },
  {
    id: 'stop-4',
    name: 'Hadapsar Wholesale Cold Terminal',
    address: 'Hadapsar, Pune',
    lat: 18.508,
    lng: 73.926,
    type: 'delivery',
    quantityKg: 5700,
    timeWindow: '02:00 PM'
  }
]

export const RouteOptimizer: React.FC = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>(DEFAULT_WAYPOINTS)
  const [result, setResult] = useState<RouteOptimizationResult>(() =>
    optimizeLogisticsRoute(DEFAULT_WAYPOINTS)
  )
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [activeTab, setActiveTab] = useState<'map' | 'stops' | 'slots'>('map')

  const handleRunOptimization = () => {
    setIsOptimizing(true)
    setTimeout(() => {
      const res = optimizeLogisticsRoute(waypoints)
      setResult(res)
      setIsOptimizing(false)
    }, 400)
  }

  const removeWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id)
    if (updated.length >= 2) {
      setWaypoints(updated)
      setResult(optimizeLogisticsRoute(updated))
    }
  }

  // Pre-configured delivery slots
  const deliveryBatches = [
    {
      slot: '08:00 AM - 10:00 AM (Morning)',
      vehicle: 'MH-12-QC-9901 (Insulated Cold Van)',
      driver: 'Kailash Salunkhe',
      stops: 4,
      totalKg: 850,
      status: 'COMPLETED'
    },
    {
      slot: '01:00 PM - 03:00 PM (Afternoon Fresh)',
      vehicle: 'MH-14-BT-3320 (Refrigerated 14ft)',
      driver: 'Santosh Jadhav',
      stops: 6,
      totalKg: 1420,
      status: 'IN_TRANSIT'
    },
    {
      slot: '06:00 PM - 08:00 PM (Evening Doorstep)',
      vehicle: 'MH-15-EG-4412 (Electric Cargo Van)',
      driver: 'Pravin Shinde',
      stops: 5,
      totalKg: 950,
      status: 'SCHEDULED'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#044d37] via-[#065f46] to-[#044d37] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                KrishiRath Cold Fleet & AI Route Optimizer
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              Nashik &rarr; Pune &rarr; Mumbai Corridors • 100 km discovery straight-line
            </p>
          </div>
        </div>

        <Button
          onClick={handleRunOptimization}
          disabled={isOptimizing}
          className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-md flex items-center gap-2 h-11 px-5"
        >
          <Sparkles className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
          <span>{isOptimizing ? 'Calculating 2-Opt...' : 'Run Route Optimization'}</span>
        </Button>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-2 border-emerald-100 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" /> Distance Saved
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-700">
                {result.distanceSavedKm} km
              </span>
              <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-300 text-[10px]">
                -{result.percentageSaved}%
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              Down from {result.originalDistanceKm} km to {result.optimizedDistanceKm} km
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Fuel className="w-3.5 h-3.5 text-amber-600" /> Fuel & Cost Cut
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{result.costSavedINR.toLocaleString()}
              </span>
              <span className="text-xs text-amber-600 font-bold">
                ({result.fuelSavedLiters} L)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Zero cloud API fees, pure client-side TSP</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" /> Carbon Offset
            </span>
            <span className="text-2xl font-black text-emerald-700 block">
              {result.co2SavedKg} kg
            </span>
            <p className="text-[11px] text-slate-500">CO2 emissions avoided per dispatch</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100 bg-white shadow-2xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Est. Total Tour
            </span>
            <span className="text-2xl font-black text-slate-900 block">
              {Math.floor(result.estimatedDurationMins / 60)}h {result.estimatedDurationMins % 60}m
            </span>
            <p className="text-[11px] text-slate-500">Includes 12m stop buffer per farm gate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'map' ? 'bg-[#044d37] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Corridor Route Visualization
        </button>
        <button
          onClick={() => setActiveTab('stops')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'stops' ? 'bg-[#044d37] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Waypoints & Sequence ({waypoints.length})
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'slots' ? 'bg-[#044d37] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2-Hour Delivery Slots
        </button>
      </div>

      {/* Tab 1: Interactive Corridor Route Visualization */}
      {activeTab === 'map' && (
        <Card className="border-2 border-slate-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-black text-slate-900">
                Optimized Farm-to-Hub Transport Corridor
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Mathematical 2-Opt path eliminates zigzag detours across the 100 km radius
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#044d37]">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                Freshness Guaranteed (18.4°C)
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {/* Animated SVG Visualizer */}
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-[#eef3f0] border border-slate-200 flex items-center justify-center shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 650 250">
                {/* Background Grid Lines */}
                <defs>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#d5e3da" strokeWidth="0.8" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Draw Route Paths */}
                {result.optimizedTour.map((wp, idx) => {
                  if (idx === result.optimizedTour.length - 1) return null
                  const next = result.optimizedTour[idx + 1]
                  // Map latitude/longitude to SVG space
                  const x1 = 50 + idx * 135
                  const y1 = idx % 2 === 0 ? 160 : 70
                  const x2 = 50 + (idx + 1) * 135
                  const y2 = (idx + 1) % 2 === 0 ? 160 : 70

                  return (
                    <g key={idx}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#044d37"
                        strokeWidth="3.5"
                        strokeDasharray="6 4"
                      />
                    </g>
                  )
                })}

                {/* Waypoint Nodes */}
                {result.optimizedTour.map((wp, idx) => {
                  const cx = 50 + idx * 135
                  const cy = idx % 2 === 0 ? 160 : 70
                  const isDepot = wp.type === 'depot'
                  const isDelivery = wp.type === 'delivery'

                  return (
                    <g key={wp.id} className="cursor-pointer group">
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isDepot || isDelivery ? 14 : 11}
                        fill={isDepot ? '#044d37' : isDelivery ? '#16a34a' : '#d97706'}
                        stroke="#fff"
                        strokeWidth="3"
                        className="shadow-md"
                      />
                      <text
                        x={cx}
                        y={cy + 4}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        {idx + 1}
                      </text>
                      <text
                        x={cx}
                        y={cy + (idx % 2 === 0 ? 30 : -20)}
                        textAnchor="middle"
                        fill="#0f172a"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {wp.name.split(' ')[0]} ({wp.type})
                      </text>
                    </g>
                  )
                })}

                {/* Animated Truck on Transit */}
                <g transform="translate(320, 105)">
                  <circle cx="12" cy="12" r="16" fill="#044d37" className="animate-pulse" />
                  <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="13">
                    🚚
                  </text>
                </g>
              </svg>
            </div>

            {/* Step by Step Sequenced Stops */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Optimized Multi-Stop Itinerary
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {result.optimizedTour.map((stop, i) => (
                  <div
                    key={stop.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-[#044d37] text-white flex items-center justify-center font-bold text-[10px]">
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{stop.timeWindow}</span>
                    </div>
                    <strong className="block text-slate-900 font-bold truncate" title={stop.name}>
                      {stop.name}
                    </strong>
                    <p className="text-[11px] text-slate-500 truncate">{stop.address}</p>
                    {stop.quantityKg > 0 && (
                      <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                        +{stop.quantityKg} kg load
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Waypoint Manager */}
      {activeTab === 'stops' && (
        <Card className="border-2 border-slate-200 shadow-sm bg-white">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base font-black text-slate-900">
              Manage Dispatch Stops
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Add or remove farm gates to recalculate the optimal route instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {waypoints.map((wp, idx) => (
              <div
                key={wp.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">{wp.name}</strong>
                    <span className="text-[11px] text-slate-500">{wp.address} • {wp.type}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {wp.quantityKg > 0 && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {wp.quantityKg} kg
                    </span>
                  )}
                  {wp.type !== 'depot' && (
                    <button
                      onClick={() => removeWaypoint(wp.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded"
                      title="Remove stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: 2-Hour Delivery Slots */}
      {activeTab === 'slots' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliveryBatches.map((batch, idx) => (
            <Card key={idx} className="border-2 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{batch.slot}</span>
                  <Badge
                    className={`text-[10px] font-bold ${
                      batch.status === 'COMPLETED'
                        ? 'bg-slate-200 text-slate-700'
                        : batch.status === 'IN_TRANSIT'
                        ? 'bg-emerald-100 text-[#044d37] border-emerald-300 border'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {batch.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <p>• <strong>Vehicle:</strong> {batch.vehicle}</p>
                  <p>• <strong>Pilot:</strong> {batch.driver}</p>
                  <p>• <strong>Load:</strong> {batch.totalKg} kg ({batch.stops} dropoffs)</p>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#044d37] h-full"
                    style={{
                      width: batch.status === 'COMPLETED' ? '100%' : batch.status === 'IN_TRANSIT' ? '65%' : '15%'
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
