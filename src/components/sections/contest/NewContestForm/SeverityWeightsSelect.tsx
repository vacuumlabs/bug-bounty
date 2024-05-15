import {Input} from '@/components/ui/Input'
import Switch from '@/components/ui/Switch'
import {Nullable} from '@/lib/types/general'
import {cn} from '@/lib/utils/client/tailwind'
import {defaultSeverityWeights} from '@/lib/utils/common/contest'
import {translateEnum} from '@/lib/utils/common/enums'
import type {SeverityWeights} from '@/server/actions/reward/calculateRewards'
import {FindingSeverity} from '@/server/db/models'

type SeverityWeightInputProps = {
  name?: string
  severity: FindingSeverity
  value: number | null
  onBlur?: () => void
  onChange: (value: number | null) => void
}

const SeverityWeightInput = ({
  name,
  severity,
  value,
  onBlur,
  onChange,
}: SeverityWeightInputProps) => {
  const handleInputBlur = () => {
    if (value === null) {
      onChange(0)
    }
    onBlur?.()
  }

  return (
    <div className="flex items-center justify-between">
      <span>{translateEnum.findingSeverity(severity)}</span>
      <div className="flex items-center gap-4">
        <Input
          name={name}
          type="number"
          className="w-[100px]"
          value={value}
          min={0}
          onChange={(e) =>
            onChange(e.target.value == '' ? null : Number(e.target.value))
          }
          onBlur={handleInputBlur}
        />
        <Switch
          onBlur={onBlur}
          checked={value !== null && value > 0}
          onCheckedChange={(checked) =>
            onChange(checked ? defaultSeverityWeights[severity] || 1 : 0)
          }
        />
      </div>
    </div>
  )
}

type SeverityWeightsSelectProps = {
  className?: string
  name?: string
  weights: Nullable<SeverityWeights>
  onBlur?: () => void
  onChange: (weights: Nullable<SeverityWeights>) => void
}

const SeverityWeightsSelect = ({
  className,
  name,
  weights,
  onBlur,
  onChange,
}: SeverityWeightsSelectProps) => {
  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <SeverityWeightInput
        value={weights.critical}
        severity={FindingSeverity.CRITICAL}
        onChange={(value) => onChange({...weights, critical: value})}
        onBlur={onBlur}
        name={name ? `${name}.critical` : undefined}
      />
      <SeverityWeightInput
        value={weights.high}
        severity={FindingSeverity.HIGH}
        onChange={(value) => onChange({...weights, high: value})}
        onBlur={onBlur}
        name={name ? `${name}.high` : undefined}
      />
      <SeverityWeightInput
        value={weights.medium}
        severity={FindingSeverity.MEDIUM}
        onChange={(value) => onChange({...weights, medium: value})}
        onBlur={onBlur}
        name={name ? `${name}.medium` : undefined}
      />
      <SeverityWeightInput
        value={weights.low}
        severity={FindingSeverity.LOW}
        onChange={(value) => onChange({...weights, low: value})}
        onBlur={onBlur}
        name={name ? `${name}.low` : undefined}
      />
      <SeverityWeightInput
        value={weights.info}
        severity={FindingSeverity.INFO}
        onChange={(value) => onChange({...weights, info: value})}
        onBlur={onBlur}
        name={name ? `${name}.info` : undefined}
      />
    </div>
  )
}

export default SeverityWeightsSelect
