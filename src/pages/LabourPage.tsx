import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'

export const LabourPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Workers' Leader & Labour Hub</h1>
          <p className="text-sm text-slate-500">Autonomous labour requests, team matching, consent rosters, daily attendance & disputes.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parallel Labour Coordination Workflow</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Enforces: Workers must consent to invites; 1 job per worker per day rule; leaders never own worker wages or accounts.
        </CardContent>
      </Card>
    </div>
  )
}
