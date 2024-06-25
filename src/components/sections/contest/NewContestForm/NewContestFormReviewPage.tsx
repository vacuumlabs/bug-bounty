import {DateTime} from 'luxon'
import {File, Link as LinkIcon} from 'lucide-react'
import Link from 'next/link'

import {NewContestFormPageProps} from './NewContestForm'

import {translateEnum} from '@/lib/utils/common/enums'
import MarkdownPreview from '@/components/markdown/MarkdownPreview'
import {formatAda} from '@/lib/utils/common/format'
import ContestSeverityWeightsDisplay from '@/components/ui/ContestSeverityWeightsDisplay'

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
    knownIssuesDescription,
    customConditions,
    timezone,
    startDate,
    endDate,
  } = getValues()

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Project name</h3>
        <p>{title}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Link to the Github repository
        </h3>
        {repository?.url ? (
          <Link href={repository.url} className="inline-flex gap-2">
            <LinkIcon />
            {repository.url}
          </Link>
        ) : (
          'No repository'
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Scope definition</h3>
        {filesInScope?.length ? (
          filesInScope.map((file) => (
            <div className="flex gap-2" key={file}>
              <File /> {file}
            </div>
          ))
        ) : (
          <p>No files in scope selected</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Project categories</h3>
        <p>
          {translateEnum.projectCategory(projectCategory) ||
            'No category selected'}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Project languages</h3>
        <p>
          {translateEnum.projectLanguage(projectLanguage) ||
            'No language selected'}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <MarkdownPreview doc={description ?? ''} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">{`Total rewards (in ADA)`}</h3>
        <p>{formatAda(Number(rewardsAmount) * 1e6)}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity rewards</h3>
        <ContestSeverityWeightsDisplay {...severityWeights} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Custom conditions</h3>
        <p>{customConditions || 'None'}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Known issues</h3>
        <p>{knownIssuesDescription || 'None'}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Audit period</h3>
        <div className="flex gap-6">
          <div>
            <span className="text-grey-30">Timezone: </span>
            <span suppressHydrationWarning>{timezone}</span>
          </div>
          <span>|</span>
          <div>
            <span className="text-grey-30">Start: </span>
            <span>{formatDate(startDate, timezone)}</span>
          </div>
          <span>|</span>
          <div>
            <span className="text-grey-30">End: </span>
            <span>{formatDate(endDate, timezone)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewContestFormReviewPage
