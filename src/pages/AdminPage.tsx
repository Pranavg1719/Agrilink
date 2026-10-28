import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ShieldCheck } from 'lucide-react'

export const AdminPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Console & Governance</h1>
          <p className="text-sm text-slate-500">Role approval (Leaders, Vendors, Partners), user suspensions, and audit log inspection.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Administration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Every administrative read of personal data and every status transition writes an immutable audit log record.
        </CardContent>
      </Card>
    </div>
  )
}
