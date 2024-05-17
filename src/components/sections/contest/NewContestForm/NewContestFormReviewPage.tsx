import {DateTime} from 'luxon'

import {NewContestFormPageProps} from './NewContestForm'

import {translateEnum} from '@/lib/utils/common/enums'
import MaybeLink from '@/components/ui/MaybeLink'
import MarkdownPreview from '@/components/markdown/MarkdownPreview'

const formatDate = (date: Date | null, timezone: string | null) =>
  date
    ? DateTime.fromJSDate(date, {zone: timezone ?? undefined}).toLocaleString(
        DateTime.DATETIME_MED,
      )
    : 'No date'

const NewContestFormReviewPage = ({form}: NewContestFormPageProps) => {
  const {getValues} = form

  const {
    title,
    repository,
    filesInScope,
    projectCategory,
    projectLanguage,
    description,
    rewardsAmount,
    severityWeights,
    customConditions,
    timezone,
    startDate,
    endDate,
  } = getValues()

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <h3>Project name</h3>
        <p className="text-sm font-bold">{title}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Link to the Github repository</h3>
        <MaybeLink className="text-sm font-bold" href={repository?.url}>
          {repository?.url ?? 'No repository'}
        </MaybeLink>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Scope definition</h3>
        {filesInScope?.length ? (
          filesInScope.map((file) => (
            <p className="text-sm font-bold" key={file}>
              {file}
            </p>
          ))
        ) : (
          <p className="text-sm font-bold">Whole repository</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3>Project categories</h3>
        {projectCategory?.length ? (
          projectCategory.map((category) => (
            <p className="text-sm font-bold" key={category}>
              {translateEnum.projectCategory(category)}
            </p>
          ))
        ) : (
          <p className="text-sm font-bold">No category selected</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3>Project languages</h3>
        {projectLanguage?.length ? (
          projectLanguage.map((language) => (
            <p className="text-sm font-bold" key={language}>
              {translateEnum.projectLanguage(language)}
            </p>
          ))
        ) : (
          <p className="text-sm font-bold">No language selected</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <h3>Description</h3>
        <MarkdownPreview doc={description ?? ''} />
      </div>
      <div className="flex flex-col gap-2">
        <h3>{`Total rewards (in ADA)`}</h3>
        <p className="text-sm font-bold">
          {Number(rewardsAmount).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Severity rewards</h3>
        <div className="flex w-[100px] flex-col gap-2 text-sm font-bold">
          <div className="item-center flex justify-between">
            <span>Critical</span>
            <span>{severityWeights.critical}</span>
          </div>
          <div className="item-center flex justify-between">
            <span>High</span>
            <span>{severityWeights.high}</span>
          </div>
          <div className="item-center flex justify-between">
            <span>Medium</span>
            <span>{severityWeights.medium}</span>
          </div>
          <div className="item-center flex justify-between">
            <span>Low</span>
            <span>{severityWeights.low}</span>
          </div>
          <div className="item-center flex justify-between">
            <span>Info</span>
            <span>{severityWeights.info}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Custom conditions</h3>
        <p className="text-sm font-bold">{customConditions || 'None'}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3>Audit period</h3>
        <p className="text-sm font-bold">{timezone}</p>
        <div className="flex gap-6">
          <p className="text-sm font-bold">{`Start: ${formatDate(startDate, timezone)}`}</p>
          <p className="text-sm font-bold">{`End: ${formatDate(endDate, timezone)}`}</p>
        </div>
      </div>
    </div>
  )
}

export default NewContestFormReviewPage
