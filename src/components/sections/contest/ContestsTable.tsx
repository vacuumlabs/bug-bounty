import ContestsTableRow from './ContestsTableRow'

import {Contest} from '@/server/db/schema/contest'

type ContestsTableProps = {
  contests: Contest[]
}

const ContestsTable = ({contests}: ContestsTableProps) => {
  return (
    <table className="w-full">
      <tbody className="flex flex-col gap-3">
        {contests.map((contest) => (
          <ContestsTableRow key={contest.id} contest={contest} />
        ))}
      </tbody>
    </table>
  )
}

export default ContestsTable
