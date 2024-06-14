import {File} from 'lucide-react'

import {NewFindingFormPageProps} from './NewFindingForm'
import FindingSeverityBadge from '../FindingSeverityBadge'

import MarkdownPreview from '@/components/markdown/MarkdownPreview'
import FileList from '@/components/ui/FileList'
import {useGetContest} from '@/lib/queries/contest/getContest'

const NewFindingFormReviewPage = ({form}: NewFindingFormPageProps) => {
  const {getValues} = form

  const {
    title,
    contestId,
    severity,
    affectedFiles,
    description,
    proofOfConcept,
    attachments,
  } = getValues()

  const {data: contest} = useGetContest(contestId ?? undefined, {
    enabled: !!contestId,
  })

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Project name</h3>
        <p>{contestId ? contest?.title : 'No contest selected.'}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Affected files</h3>
        {affectedFiles?.length ? (
          affectedFiles.map((file) => (
            <div className="flex gap-2" key={file}>
              <File /> {file}
            </div>
          ))
        ) : (
          <p>No affected files selected.</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity level</h3>
        {severity ? (
          <FindingSeverityBadge severity={severity} className="self-start" />
        ) : (
          <p>No severity selected.</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Report title</h3>
        <p>{title}</p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <MarkdownPreview doc={description ?? ''} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Proof of concept</h3>
        <MarkdownPreview doc={proofOfConcept ?? ''} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Uploaded files</h3>
        {attachments?.length ? (
          <FileList files={attachments} className="mt-3" />
        ) : (
          <p>No attached files.</p>
        )}
      </div>
    </div>
  )
}

export default NewFindingFormReviewPage
