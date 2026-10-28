import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Gavel } from 'lucide-react'

export const BidsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
          <Gavel className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bids & Wholesale Deals</h1>
          <p className="text-sm text-slate-500">Atomic bidding, farmer inbox, inspection scheduling, and confirmed terms snapshot.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wholesale Transaction State Machine</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Allowed transitions: Bids (placed &rarr; countered &rarr; accepted; exits: rejected, withdrawn, expired) &rarr; Inspection &rarr; Confirmed Order.
        </CardContent>
      </Card>
    </div>
  )
}
