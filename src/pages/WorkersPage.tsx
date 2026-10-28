import React, { useState } from 'react'
import { Users, UserCheck, ShieldCheck, CheckCircle2, Clock, AlertTriangle, Plus } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DemoBadge } from '@/components/common/DemoBadge'
import { useAuth } from '@/context/AuthContext'

export const WorkersPage: React.FC = () => {
  const { user } = useAuth()
  const [members, setMembers] = useState([
    {
      id: 'wm-1',
      name: 'Babu Rao',
      skills: ['Tomato Harvest', 'Grading'],
      consentDate: '15 Oct 2026',
      assignedJobToday: 'Ramesh Patil Farm (Tomato Picking)',
      attendanceStatus: 'present',
      disputeRaised: false,
      isDemo: true
    },
    {
      id: 'wm-2',
      name: 'Kashinath Dube',
      skills: ['Onion Pulling', 'Sacking'],
      consentDate: '18 Oct 2026',
      assignedJobToday: 'None (Available)',
      attendanceStatus: 'available',
      disputeRaised: false,
      isDemo: true
    },
    {
      id: 'wm-3',
      name: 'Sunita Bai',
      skills: ['Potato Sorting', 'Grading'],
      consentDate: '20 Oct 2026',
      assignedJobToday: 'Ramesh Patil Farm (Tomato Picking)',
      attendanceStatus: 'present',
      disputeRaised: false,
      isDemo: true
    }
  ])

  const [attendanceMarked, setAttendanceMarked] = useState(false)

  const toggleAttendance = (id: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        return {
          ...m,
          attendanceStatus: m.attendanceStatus === 'present' ? 'absent' : 'present'
        }
      }
      return m
    }))
    setAttendanceMarked(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#044d37] via-[#065f46] to-[#044d37] text-white p-6 rounded-3xl shadow-lg border border-emerald-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl border border-white/20 shadow-inner">
            🤝
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {user?.fullName || 'Gangaram Shinde (मजदूर मुकादम)'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
              Niphad Agricultural Labor Squad • Capacity: 12 Workers • Government DBT Registered
            </p>
          </div>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400 border text-xs px-3 py-1 font-bold">
          Leader Console
        </Badge>
      </div>

      {/* Roster & Consent Rules Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-sm font-bold block">Voluntary Labour Protection Guardrails (FR-LABOUR-005 &amp; 009)</strong>
          <p>
            Leaders do not own worker accounts, wages, or identity papers. Workers appear on rosters only after voluntary consent and can leave anytime. A worker cannot be assigned to two jobs on the same calendar day.
          </p>
        </div>
      </div>

      {/* Team Roster & Attendance Table */}
      <Card className="border-2 border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black text-slate-900">
              Active Team Roster &amp; Daily Attendance
            </CardTitle>
            <span className="text-xs text-slate-500">
              One row per worker per day &bull; Workers can inspect and dispute attendance
            </span>
          </div>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
            <Plus className="w-3.5 h-3.5 mr-1" /> Send Team Invite
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {members.map((m) => (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-black text-slate-900">{m.name}</strong>
                    <DemoBadge isDemo={m.isDemo} />
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Consented: {m.consentDate}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Assignment: <strong className="text-slate-800">{m.assignedJobToday}</strong>
                  </p>
                  <div className="flex gap-1 pt-0.5">
                    {m.skills.map(s => (
                      <span key={s} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleAttendance(m.id)}
                    size="sm"
                    className={`font-bold text-xs h-9 px-4 ${
                      m.attendanceStatus === 'present'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {m.attendanceStatus === 'present' ? '✓ Present Marked' : 'Mark Present'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
