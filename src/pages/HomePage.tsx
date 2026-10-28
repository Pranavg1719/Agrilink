import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Sprout, 
  Gavel, 
  Users, 
  Truck, 
  Store, 
  ShieldCheck, 
  ArrowRight, 
  Cpu, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Building2,
  TrendingUp,
  Fuel,
  Volume2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/common/DemoBadge'
import { useAuth } from '@/context/AuthContext'
import { speakText } from '@/lib/speech'

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  const handleVoiceIntroduction = () => {
    const lang = i18n.language.startsWith('hi') ? 'hi' : 'en'
    const msg = lang === 'hi'
      ? `एग्रीलिंक राष्ट्रीय कृषि आपूर्ति ग्रिड है. यह खेत से घर तक किसानों, व्यापारियों, परिवहन और उपभोक्ताओं को जोड़ता है.`
      : `AgriLink is a zero-cost connected agricultural ecosystem connecting farmers, buyers, cold fleet transport, and consumers in one pipeline.`
    speakText(msg, lang)
  }

  const rolePortals = [
    {
      title: 'Farmer App (किसान)',
      desc: 'On-device AI Crop Quality Scanner, 100 km transparent buyer bids, and direct DBT payouts.',
      to: '/farmer',
      icon: Sprout,
      badge: 'AI Scanner Active',
      color: 'border-emerald-300 hover:border-emerald-600',
      tagColor: 'bg-emerald-50 text-emerald-800'
    },
    {
      title: 'Cold Logistics Fleet (परिवहन)',
      desc: 'Client-side 2-Opt TSP route optimizer, cold transit freshness monitoring (18.4°C), and fuel cut.',
      to: '/logistics',
      icon: Truck,
      badge: '2-Opt Route Optimizer',
      color: 'border-blue-300 hover:border-blue-600',
      tagColor: 'bg-blue-50 text-blue-800'
    },
    {
      title: 'Vendor Hub (इन्वेंटरी)',
      desc: 'Append-only inventory lots, automated lot balance tracking, and fixed retail store conversion.',
      to: '/vendor',
      icon: Building2,
      badge: 'Atomic Lots',
      color: 'border-purple-300 hover:border-purple-600',
      tagColor: 'bg-purple-50 text-purple-800'
    },
    {
      title: 'Worker Leader (मजदूर मुकादम)',
      desc: 'Voluntary consent rosters, 1 job per day anti-conflict rule, and worker attendance marking.',
      to: '/workers',
      icon: Users,
      badge: 'Consent Protected',
      color: 'border-amber-300 hover:border-amber-600',
      tagColor: 'bg-amber-50 text-amber-800'
    },
    {
      title: 'Consumer Fresh Store (दुकान)',
      desc: 'Direct harvest-to-doorstep produce ordering, 2-hour slot delivery, and live order tracking.',
      to: '/store',
      icon: Store,
      badge: '2-Hr Slots',
      color: 'border-rose-300 hover:border-rose-600',
      tagColor: 'bg-rose-50 text-rose-800'
    },
    {
      title: 'Govt Admin & Audit (प्रशासन)',
      desc: 'Role approval for leaders & transport, immutable audit log verification, and dispute resolution.',
      to: '/admin',
      icon: ShieldCheck,
      badge: 'Immutable Audit',
      color: 'border-slate-300 hover:border-slate-800',
      tagColor: 'bg-slate-100 text-slate-800'
    }
  ]

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#044d37] via-[#065f46] to-[#023123] text-white p-6 sm:p-12 shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-400/40 text-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart India Hackathon 2026 &bull; Problem Statement SIH26033</span>
            </span>
            <button
              onClick={handleVoiceIntroduction}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 hover:bg-black/50 text-emerald-200 text-xs font-semibold border border-emerald-500/30 transition-all"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Listen Overview</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            One Connected Agricultural Pipeline: Farm to Doorstep
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-medium">
            AI crop quality estimation in &lt;60s, transparent 100 km mandi bidding, client-side cold fleet route optimization, and protected farm labour — built on a verifiable <strong>$0 infrastructure stack</strong>.
          </p>

          <div className="flex flex-wrap gap-3 pt-3">
            <Button asChild size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black shadow-md h-12 px-6">
              <Link to="/farmer" className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-slate-950" />
                <span>Open Farmer Portal &rarr;</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-bold h-12 px-6">
              <Link to="/logistics" className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-300" />
                <span>Cold Fleet Route Optimizer</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-96 h-96 text-white" />
        </div>
      </section>

      {/* Grid of Key Role Portals */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-6 h-6 text-emerald-700" />
              <span>Role Portals &amp; Workflows</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Switch roles freely to test any actor in the agricultural ecosystem
            </p>
          </div>
          <Link
            to="/auth"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
          >
            Manage Portals &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rolePortals.map((portal) => {
            const Icon = portal.icon
            return (
              <Link
                key={portal.title}
                to={portal.to}
                className={`bg-white p-6 rounded-3xl border-2 transition-all shadow-xs hover:shadow-xl flex flex-col justify-between group ${portal.color}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#044d37] border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${portal.tagColor}`}>
                      {portal.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-black text-base text-slate-900 group-hover:text-[#044d37] transition-colors">
                      {portal.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {portal.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-bold text-[#044d37]">
                  <span>Launch Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Feature Focus: Algorithmic Route Optimization & AI Crop Scanner */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Route Optimizer Callout */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <Badge className="bg-emerald-100 text-[#044d37] font-bold text-xs border border-emerald-300">
                Logistics Algorithm
              </Badge>
              <Fuel className="w-5 h-5 text-amber-600" />
            </div>
            <CardTitle className="text-lg font-black text-slate-900 mt-2">
              Mathematical 2-Opt Route Optimization
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Zero paid map API cost. Computes Haversine distance matrix, greedy nearest neighbor tour, and 2-opt iterative edge swaps.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">KM CUT</span>
                <strong className="text-emerald-700 text-sm font-black">-18.4%</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">DIESEL SAVED</span>
                <strong className="text-slate-900 text-sm font-black">₹3,400+</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-400 block text-[10px] font-bold">TEMPERATURE</span>
                <strong className="text-blue-700 text-sm font-black">18.4°C IoT</strong>
              </div>
            </div>
            <Button asChild className="w-full bg-[#044d37] hover:bg-emerald-800 text-white font-bold text-xs">
              <Link to="/logistics">Open Interactive Route Optimizer &rarr;</Link>
            </Button>
          </CardContent>
        </Card>

        {/* On-Device AI Scanner Callout */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/40 shadow-sm overflow-hidden">
          <CardHeader className="p-6 pb-2">
            <div className="flex justify-between items-center">
              <Badge className="bg-emerald-100 text-[#044d37] font-bold text-xs border border-emerald-300">
                Client AI Vision
              </Badge>
              <Cpu className="w-5 h-5 text-emerald-600" />
            </div>
            <CardTitle className="text-lg font-black text-slate-900 mt-2">
              On-Device Crop Quality Evaluation
            </CardTitle>
            <CardDescription className="text-xs text-slate-600">
              Evaluates surface texture, hue distribution, and blemishes in browser Web Worker. Blurry and dark captures are rejected.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-3 space-y-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
              <p className="font-semibold text-slate-800">
                • <strong>Crops Supported:</strong> Tomato, Onion, Potato
              </p>
              <p className="font-semibold text-slate-800">
                • <strong>Guaranteed Guardrail:</strong> "Estimate from photos, not a certification"
              </p>
              <p className="font-semibold text-slate-800">
                • <strong>Compression:</strong> Compresses images to &le;300 KB locally before upload
              </p>
            </div>
            <Button asChild className="w-full bg-[#044d37] hover:bg-emerald-800 text-white font-bold text-xs">
              <Link to="/farmer">Launch AI Crop Scanner &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
