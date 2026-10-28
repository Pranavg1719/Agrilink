import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Sprout, 
  Menu, 
  X, 
  Languages, 
  Store, 
  Users, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  Gavel,
  Home,
  CloudSun,
  Volume2,
  Building2,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RolePortalSwitcher } from '@/components/auth/RolePortalSwitcher'
import { useAuth } from '@/context/AuthContext'
import { speakText } from '@/lib/speech'

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const location = useLocation()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }) + ', ' + now.toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
  }

  const handleVoiceHelp = () => {
    const lang = i18n.language.startsWith('hi') ? 'hi' : 'en'
    const msg = lang === 'hi'
      ? `नमस्ते ${user?.fullName || 'किसान भाई'}. एग्रीलिंक में आपका स्वागत है. यहाँ आप एआई फसल स्कैनर द्वारा गुणवत्ता जाँच सकते हैं, बोलियां देख सकते हैं, और सीधी आपूर्ति कर सकते हैं.`
      : `Welcome ${user?.fullName || 'User'} to AgriLink. You can scan crops for AI quality estimates, view transparent 100km bids, and coordinate cold transport.`
    speakText(msg, lang)
  }

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/farmer', label: 'Farmer Portal', icon: Sprout },
    { to: '/bids', label: 'Bids & Deals', icon: Gavel },
    { to: '/vendor', label: 'Vendor Hub', icon: Building2 },
    { to: '/workers', label: 'Labour Hub', icon: Users },
    { to: '/logistics', label: 'Fleet & Routes', icon: Truck },
    { to: '/store', label: 'Consumer Store', icon: ShoppingBag },
    { to: '/admin', label: 'Govt Admin', icon: ShieldCheck }
  ]

  return (
    <header className="sticky top-0 z-50 bg-[#044d37] text-white border-b border-emerald-800 shadow-md">
      {/* Top Status & Weather Bar */}
      <div className="bg-[#023123] text-emerald-200 text-[11px] px-4 sm:px-6 py-1.5 flex items-center justify-between border-b border-emerald-900/60">
        <div className="flex items-center gap-2.5">
          <span className="text-sm">🌾</span>
          <span className="font-bold text-white">
            {user ? user.fullName : 'Ramesh Patil (रमेश पाटील)'}
          </span>
          <span className="hidden sm:inline text-emerald-400">•</span>
          <span className="hidden sm:inline font-mono text-[10px] text-emerald-300">
            {timeStr}
          </span>
          <span className="hidden md:inline text-emerald-500">•</span>
          <span className="hidden md:inline text-emerald-300 font-medium">
            {user?.villageDistrict || 'Nashik Grid'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-300 font-medium text-xs">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">26°C Sunny • Agri Grid</span>
          </span>

          <span className="text-emerald-700">|</span>

          {/* Voice Help Accessibility Button */}
          <button
            type="button"
            onClick={handleVoiceHelp}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#044d37] hover:bg-emerald-700 text-emerald-200 border border-emerald-600 transition-colors"
            title="Listen Voice Help (ग्रामीण ध्वनि सहायता)"
          >
            <Volume2 className="w-3 h-3 text-amber-300" />
            <span className="hidden xs:inline">Voice Help</span>
          </button>

          <span className="text-emerald-700">|</span>

          {/* Language Switcher Buttons */}
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-1.5 py-0.5 rounded ${
                !i18n.language.startsWith('hi')
                  ? 'bg-emerald-600 text-white font-black'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => toggleLanguage('hi')}
              className={`px-1.5 py-0.5 rounded ${
                i18n.language.startsWith('hi')
                  ? 'bg-emerald-600 text-white font-black'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              HI
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight leading-none text-white">
                  Agri<span className="text-emerald-300">Link</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                  SIH2026
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/80 font-medium">
                Farm to Doorstep Agricultural Grid
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-black/25 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = location.pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                    active
                      ? 'bg-white text-[#044d37] shadow-sm font-black'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Action Controls: Role Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-2.5">
            <RolePortalSwitcher />

            <Link
              to="/store"
              className="hidden sm:flex bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-xs items-center gap-1.5 border border-emerald-400 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Store Basket</span>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white/10 text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="xl:hidden bg-[#023123] border-t border-emerald-800 px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold min-h-[44px] ${
                  active
                    ? 'bg-white text-[#044d37] font-black'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-400" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
