import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { FlaskConical } from 'lucide-react'

interface DemoBadgeProps {
  isDemo?: boolean
  className?: string
}

export const DemoBadge: React.FC<DemoBadgeProps> = ({ isDemo = true, className = '' }) => {
  const { t } = useTranslation()
  
  if (!isDemo) return null

  return (
    <Badge 
      variant="demo" 
      className={`inline-flex items-center gap-1 bg-amber-100 text-amber-900 border-amber-300 font-medium px-2 py-0.5 rounded ${className}`}
      title="This record is demo data, not a live verified transaction"
    >
      <FlaskConical className="w-3 h-3 text-amber-700" />
      <span>{t('app.demo_badge', 'Demo Data')}</span>
    </Badge>
  )
}
