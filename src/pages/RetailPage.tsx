import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Store } from 'lucide-react'

export const RetailPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Retail Store & Inventory Lots</h1>
          <p className="text-sm text-slate-500">Fixed-price vendor lots, atomic stock reservation, and doorstep delivery.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retail Store Pipeline</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Append-only inventory lot movements ensure vendor stock balances are computed accurately and atomically.
        </CardContent>
      </Card>
    </div>
  )
}
