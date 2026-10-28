import React from 'react'
import { RouteOptimizer } from '@/components/logistics/RouteOptimizer'

export const LogisticsPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <RouteOptimizer />
    </div>
  )
}
