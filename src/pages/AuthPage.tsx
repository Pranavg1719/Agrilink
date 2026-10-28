import React, { useState } from 'react'
import { useAuth, type UserRole } from '@/context/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KeyRound, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const AuthPage: React.FC = () => {
  const { user, loginAsRole, customLogin, allDemoUsers } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'demo' | 'custom'>('demo')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole>('Farmer')
  const [successMsg, setSuccessMsg] = useState('')

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !fullName) return
    customLogin(email, selectedRole, fullName)
    setSuccessMsg(`Welcome ${fullName}! Signed in as ${selectedRole}.`)
    setTimeout(() => {
      navigate('/')
    }, 800)
  }

  const handleSelectDemo = (role: UserRole) => {
    loginAsRole(role)
    navigate('/')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          AgriLink Portals &amp; Authentication
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          One account, one verified role. Instant 1-click evaluation personas for hackathon judges &amp; real registration.
        </p>
      </div>

      {/* Switcher Tab */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 rounded-2xl bg-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('demo')}
            className={`px-6 py-2 rounded-xl transition-all ${
              activeTab === 'demo' ? 'bg-[#044d37] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Instant Role Test Personas (10 Roles)
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-6 py-2 rounded-xl transition-all ${
              activeTab === 'custom' ? 'bg-[#044d37] text-white shadow-xs' : 'text-slate-600'
            }`}
          >
            Custom Sign In / Register
          </button>
        </div>
      </div>

      {/* Tab 1: Instant Role Cards */}
      {activeTab === 'demo' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {(Object.keys(allDemoUsers) as UserRole[]).map((r) => {
            const persona = allDemoUsers[r]
            const isCurrent = user?.role === r
            return (
              <Card
                key={r}
                className={`border-2 transition-all hover:shadow-md cursor-pointer ${
                  isCurrent ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white'
                }`}
                onClick={() => handleSelectDemo(r)}
              >
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {r}
                    </span>
                    {isCurrent && (
                      <Badge className="bg-emerald-600 text-white text-[10px]">Active</Badge>
                    )}
                  </div>
                  <strong className="text-sm font-bold text-slate-900 block truncate">
                    {persona.fullName}
                  </strong>
                  <p className="text-xs text-slate-500 truncate">{persona.location}</p>
                  <Button
                    size="sm"
                    className="w-full mt-2 bg-[#044d37] hover:bg-emerald-800 text-white font-bold text-xs h-9"
                  >
                    Enter as {r} &rarr;
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Tab 2: Custom Sign In Form */}
      {activeTab === 'custom' && (
        <Card className="max-w-md mx-auto border-2 border-slate-200 shadow-sm bg-white">
          <CardHeader className="p-5 pb-3">
            <CardTitle className="text-base font-bold text-slate-900">
              Sign In or Register New Account
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Anand Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anand@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Choose Single Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                  >
                    {(Object.keys(allDemoUsers) as UserRole[]).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full bg-[#044d37] hover:bg-emerald-800 text-white font-bold h-11 text-xs">
                  Continue to AgriLink
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
