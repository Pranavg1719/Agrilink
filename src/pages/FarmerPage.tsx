import React, { useState } from 'react'
import { 
  Camera, 
  Award, 
  Users, 
  TrendingUp, 
  MapPin, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Gavel,
  Volume2
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AiCropScanner } from '@/components/farmer/AiCropScanner'
import { DemoBadge } from '@/components/common/DemoBadge'
import { useAuth } from '@/context/AuthContext'
import { speakText } from '@/lib/speech'
import { useTranslation } from 'react-i18next'

export const FarmerPage: React.FC = () => {
  const { user } = useAuth()
  const { i18n } = useTranslation()
  const [activeTab, setActiveTab] = useState<'scanner' | 'bids' | 'labour' | 'mandi'>('scanner')

  // Live bids state
  const [bids, setBids] = useState([
    {
      id: 'bid-101',
      buyerName: 'Priya Sharma (Vashi APMC Wholesale)',
      crop: 'Tomato (Hybrid Red)',
      quantityKg: 2000,
      bidPricePerKg: 24,
      askingPricePerKg: 22,
      distanceKm: 42,
      status: 'placed',
      expiresInHours: 36,
      isDemo: true
    },
    {
      id: 'bid-102',
      buyerName: 'Pune Fresh Supermart Network',
      crop: 'Tomato (Hybrid Red)',
      quantityKg: 2500,
      bidPricePerKg: 21,
      askingPricePerKg: 22,
      distanceKm: 78,
      status: 'placed',
      expiresInHours: 18,
      isDemo: true
    },
    {
      id: 'bid-103',
      buyerName: 'Sanjay Agro Processors',
      crop: 'Onion (Nashik Red)',
      quantityKg: 4000,
      bidPricePerKg: 29,
      askingPricePerKg: 28,
      distanceKm: 28,
      status: 'placed',
      expiresInHours: 42,
      isDemo: true
    }
  ])

  // Accepted bid notification state
  const [acceptedBidId, setAcceptedBidId] = useState<string | null>(null)

  // Labour requests state
  const [labourSubmitted, setLabourSubmitted] = useState(false)
  const [workersNeeded, setWorkersNeeded] = useState(6)
  const [wageOffer, setWageOffer] = useState(450)

  const handleAcceptBid = (id: string) => {
    setBids(bids.map(b => b.id === id ? { ...b, status: 'accepted' } : b))
    setAcceptedBidId(id)
  }

  const handleVoiceWelcome = () => {
    const lang = i18n.language.startsWith('hi') ? 'hi' : 'en'
    const msg = lang === 'hi'
      ? `नमस्कार रमेश पाटील. आपके खेत के लिए तीन बोलियां आई हुई हैं. टमाटर के लिए 24 रुपये प्रति किलो की बोली उपलब्ध है. आप यहाँ से सीधे स्वीकार कर सकते हैं.`
      : `Welcome Ramesh. You have 3 incoming bids for your harvest. Highest bid is 24 rupees per kg from Vashi APMC. You can accept and book inspection here.`
    speakText(msg, lang)
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Profile & Greeting Card */}
      <div className="bg-gradient-to-r from-[#044d37] via-[#065f46] to-[#044d37] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            👨‍🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌾</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {user?.fullName || 'Ramesh Patil (रमेश पाटील)'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              Dindori Taluka, Nashik • Direct DBT Account Linked &bull; Verified Farm
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleVoiceWelcome}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#023123] text-emerald-300 border border-emerald-400 hover:bg-emerald-900 transition-all shadow-xs"
          title="Tap to listen to this content aloud in regional audio"
        >
          <Volume2 className="w-4 h-4 text-emerald-300" />
          <span>Listen Voice Help</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'scanner'
              ? 'bg-[#044d37] text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. AI Crop Scanner &amp; Sell</span>
        </button>

        <button
          onClick={() => setActiveTab('bids')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'bids'
              ? 'bg-[#044d37] text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>2. Live Bids ({bids.filter(b => b.status === 'placed').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('labour')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'labour'
              ? 'bg-[#044d37] text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Request Farm Labour</span>
        </button>

        <button
          onClick={() => setActiveTab('mandi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'mandi'
              ? 'bg-[#044d37] text-white shadow-md font-black'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>4. Mandi Rates &amp; Advice</span>
        </button>
      </div>

      {/* Tab 1: AI Scanner & Publish Listing */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          <AiCropScanner />

          {/* Quick Publish Details Form */}
          <Card className="border-2 border-slate-200 shadow-sm bg-white">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-black text-slate-900">
                Confirm Listing Quantity &amp; Asking Price
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Harvest Quantity (kg)
                  </label>
                  <input
                    type="number"
                    defaultValue={2500}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Asking Price (₹/kg)
                  </label>
                  <input
                    type="number"
                    defaultValue={24}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Within indicative band (₹20 - ₹26)
                  </span>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Availability Window
                  </label>
                  <input
                    type="text"
                    defaultValue="Next 48 Hours"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                  Publish to 100 km Buyer Grid
                </Button>
                <Button variant="outline" className="border-slate-300">
                  Save Offline Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Live Bids Inbox */}
      {activeTab === 'bids' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-slate-900">
              Incoming Buyer Bids (100 km Radius)
            </h3>
            <span className="text-xs text-slate-500">
              Straight-line approx. distance • Highest bid does not auto-win
            </span>
          </div>

          {acceptedBidId && (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-sm font-bold block">
                  Bid Accepted! Deal Transitioned to Physical Inspection
                </strong>
                <p>
                  Reserved quantity has been atomically locked. Contact telephone number is now unlocked for both parties. Next step: confirm date/time for produce inspection.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {bids.map((b) => (
              <Card key={b.id} className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <DemoBadge isDemo={b.isDemo} />
                      <Badge className="bg-slate-100 text-slate-700 border border-slate-300 text-[10px]">
                        ~{b.distanceKm} km (approx. distance)
                      </Badge>
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {b.expiresInHours}h left
                      </span>
                    </div>

                    <h4 className="font-bold text-base text-slate-900">{b.buyerName}</h4>
                    <p className="text-xs text-slate-600">
                      Crop: <strong>{b.crop}</strong> &bull; Demanded: <strong>{b.quantityKg} kg</strong>
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <span className="text-xl font-black text-emerald-700">
                        ₹{b.bidPricePerKg}/kg
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        Asking: ₹{b.askingPricePerKg}/kg
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Total: ₹{(b.bidPricePerKg * b.quantityKg).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {b.status === 'accepted' ? (
                      <Badge className="bg-emerald-600 text-white font-bold px-4 py-2 text-xs">
                        ✓ Deal Accepted
                      </Badge>
                    ) : (
                      <>
                        <Button
                          onClick={() => handleAcceptBid(b.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-5 text-xs flex-1 sm:flex-none"
                        >
                          Accept Bid
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-300 text-slate-700 font-semibold h-10 text-xs"
                        >
                          Counter Offer
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Request Farm Labour */}
      {activeTab === 'labour' && (
        <Card className="border-2 border-slate-200 shadow-sm bg-white">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Book Harvesting Labour Team</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0 space-y-4">
            {labourSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <strong className="text-sm font-bold block">
                    Labour Request Dispatched to Nearby Workers' Leaders!
                  </strong>
                  <p>
                    Matching teams within 25 km. Gangaram Shinde (Niphad Squad, 12 workers) has received your request at ₹{wageOffer}/day.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Harvest Task</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-semibold">
                      <option>Tomato Picking &amp; Grading</option>
                      <option>Onion Uprooting &amp; Trimming</option>
                      <option>Potato Digging &amp; Sacking</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Workers Needed</label>
                    <input
                      type="number"
                      value={workersNeeded}
                      onChange={(e) => setWorkersNeeded(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Proposed Daily Wage (₹/worker/day)
                    </label>
                    <input
                      type="number"
                      value={wageOffer}
                      onChange={(e) => setWageOffer(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Policy Reminder:</strong> A leader never owns worker identity or wages. Workers must voluntarily accept team invites and can leave at any time.
                </div>

                <Button
                  onClick={() => setLabourSubmitted(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 px-6 text-xs"
                >
                  Find Matching Teams ({workersNeeded} workers &bull; ₹{wageOffer * workersNeeded}/day total)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Mandi Rates & Advice */}
      {activeTab === 'mandi' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { crop: 'Tomato', min: 18, max: 28, modal: 24, mandi: 'Nashik APMC', date: '28 Oct 2026' },
            { crop: 'Onion', min: 22, max: 34, modal: 29, mandi: 'Lasalgaon APMC', date: '28 Oct 2026' },
            { crop: 'Potato', min: 14, max: 22, modal: 18, mandi: 'Pune Gultekdi', date: '27 Oct 2026' }
          ].map((m) => (
            <Card key={m.crop} className="border-2 border-slate-200 shadow-sm bg-white">
              <CardContent className="p-5 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-base text-slate-900">{m.crop}</h4>
                  <DemoBadge isDemo={true} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-700">₹{m.modal}/kg</span>
                  <span className="text-xs text-slate-500 font-semibold">(Modal Price)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Band: <strong>₹{m.min}</strong> to <strong>₹{m.max}</strong> / kg
                </p>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                  <span>Source: {m.mandi}</span>
                  <span>{m.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
