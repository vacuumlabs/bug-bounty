import Link from 'next/link'
import {FileUp, LinkIcon} from 'lucide-react'

import FindingSeverityBadge from './FindingSeverityBadge'
import FindingDetailsJudge from './FindingDetailsJudge'

import {Finding} from '@/server/actions/finding/getFinding'

type FindingDetailsProps = {
  data: Omit<Finding, 'deduplicatedFinding'>
}

const FindingDetails = ({data}: FindingDetailsProps) => {
  return (
    <div>
      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Links to affected code</h3>
        {data.affectedFiles.map((fileUrl) => (
          <Link
            href={data.contest.repoUrl}
            key={fileUrl}
            className="flex gap-3">
            <span>{fileUrl}</span>
            <LinkIcon width={24} height={24} />
          </Link>
        ))}
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity level</h3>
        <div>
          <FindingSeverityBadge severity={data.severity} />
        </div>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Report title</h3>
        <span className="text-bodyM">{data.title}</span>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <p className="text-bodyM">{data.description}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Proof of concept</h3>
        <p className="text-bodyM">{data.proofOfConcept}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Uploaded files</h3>
        <div className="flex flex-wrap items-center gap-3">
          {data.findingAttachments.length > 0 ? (
            data.findingAttachments.map((attachment) => (
              <Link
                key={attachment.attachmentUrl}
                href={attachment.attachmentUrl}
                className="flex items-center gap-2">
                <FileUp width={16} height={16} />
                <span className="text-bodyM">{attachment.fileName}</span>
              </Link>
            ))
          ) : (
            <span>No files uploaded</span>
          )}
        </div>
      </div>
      <FindingDetailsJudge data={data} />
    </div>
  )
}

export default FindingDetails
