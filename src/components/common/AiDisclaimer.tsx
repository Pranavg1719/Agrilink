import React from 'react'
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface AiDisclaimerProps {
  grade?: 'Good' | 'Medium' | 'Poor' | null
  confidence?: number | null // e.g., 0.85 (85%)
  confidenceThreshold?: number // Default 0.70 (70%)
  reasonTags?: string[]
  isUncertain?: boolean
  className?: string
}

export const AiDisclaimer: React.FC<AiDisclaimerProps> = ({
  grade,
  confidence = 0,
  confidenceThreshold = 0.70,
  reasonTags = [],
  isUncertain = false,
  className = ''
}) => {
  const { t } = useTranslation()
  const confPercent = confidence ? Math.round(confidence * 100) : 0
  const belowThreshold = isUncertain || (confidence !== null && confidence !== undefined && confidence < confidenceThreshold)

  return (
    <div className={`rounded-lg border p-3.5 text-sm space-y-2 ${belowThreshold ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50 border-emerald-200 text-emerald-950'} ${className}`}>
      <div className="flex items-start gap-2.5">
        {belowThreshold ? (
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-base">
              {belowThreshold
                ? t('ai.uncertain', 'Uncertain, physical inspection needed')
                : `${grade ? t(`ai.grade_${grade.toLowerCase()}`, `${grade} Quality`) : ''} (${confPercent}% ${t('ai.confidence', 'Confidence')})`}
            </span>
          </div>

          <p className="text-xs mt-1 text-slate-600 font-medium italic">
            * {t('ai.disclaimer', 'Estimate from photos, not a certification')}
          </p>

          {reasonTags && reasonTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {reasonTags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-white/80 border border-slate-200 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
