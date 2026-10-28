import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

export const CreateListingPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
          <PlusCircle className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Crop Listing</h1>
          <p className="text-sm text-slate-500">Step 5 & 6 will wire the full browser photo compression & on-device AI grading.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Crop Details & Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>This form will implement:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Crop selection (Onion, Tomato, Potato) and harvest date validation</li>
            <li>Client-side compression (max 300 KB per photo, stripping EXIF/GPS metadata)</li>
            <li>Local offline draft persistence via IndexedDB / localStorage</li>
            <li>Indicative Mandi price band integration (low, high, modal)</li>
            <li>In-browser ONNX evaluation with "Estimate from photos, not a certification"</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
