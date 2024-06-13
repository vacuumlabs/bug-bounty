import ButtonSelect from '@/components/ui/ButtonSelect'
import {selectOptions} from '@/lib/utils/common/enums'
import {FindingSeverity} from '@/server/db/models'

const severityTooltipContents = {
  [FindingSeverity.CRITICAL]: (
    <div className="space-y-4">
      <h3>Description:</h3>
      <p className="text-bodyS">
        Theft of user funds, permanent freezing of funds, protocol insolvency,
        etc.
      </p>
    </div>
  ),
  [FindingSeverity.HIGH]: (
    <div className="space-y-4">
      <h3>Description:</h3>
      <p className="text-bodyS">
        Theft of unclaimed yield, permanent freezing of unclaimed yield,
        temporary freezing of funds, etc.
      </p>
    </div>
  ),
  [FindingSeverity.MEDIUM]: (
    <div className="space-y-4">
      <h3>Description:</h3>
      <p className="text-bodyS">
        Smart contract unable to operate, partial theft of funds/yield, etc.
      </p>
    </div>
  ),
  [FindingSeverity.LOW]: (
    <div className="space-y-4">
      <h3>Description:</h3>
      <p className="text-bodyS">
        Contract fails to deliver promised returns, but does not lose user
        funds.
      </p>
    </div>
  ),
  [FindingSeverity.INFO]: (
    <div className="space-y-4">
      <h3>Description:</h3>
      <p className="text-bodyS">
        Best practices, code style, readability, documentation, etc.
      </p>
    </div>
  ),
}

const severitySelectOptions = selectOptions.findingSeverity.map((option) => ({
  ...option,
  tooltipContent: severityTooltipContents[option.value],
}))

type FindingSeverityButtonSelectProps = {
  value: FindingSeverity | null | undefined
  onChange: (value: FindingSeverity) => void
  className?: string
}

const FindingSeverityButtonSelect = (
  props: FindingSeverityButtonSelectProps,
) => {
  return <ButtonSelect {...props} options={severitySelectOptions} />
}

export default FindingSeverityButtonSelect
