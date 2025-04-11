'use client'

import Link from 'next/link'
import {LinkIcon} from 'lucide-react'
import {useState} from 'react'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useSession} from 'next-auth/react'

import ContestInfoJudge from './ContestInfoJudge'

import {Contest} from '@/server/actions/contest/getContest'
import ContestSeverityWeightsDisplay from '@/components/ui/ContestSeverityWeightsDisplay'
import {formatAda} from '@/lib/utils/common/format'
import {
  DialogRoot,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/Dialog'
import {Button} from '@/components/ui/Button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {rewardsTransferTxHashSchema} from '@/server/utils/validations/schemas'
import {useAddContestRewardsTransferTxHash} from '@/lib/queries/contest/editContest'
import {toast} from '@/components/ui/Toast'
import {Input} from '@/components/ui/Input'
import {ContestStatus, UserRole} from '@/server/db/models'
import MarkdownPreview from '@/components/markdown/MarkdownPreview'

type ContestInfoProps = {
  contest: Contest
  showRewardsAmount?: boolean
}

const formSchema = z.object({
  rewardsTransferTxHash: rewardsTransferTxHashSchema,
})

type FormValues = z.infer<typeof formSchema>

const ContestInfo = ({
  contest,
  showRewardsAmount = false,
}: ContestInfoProps) => {
  const {data: session} = useSession()
  const [isAddTxHashPoupupOpen, setIsAddTxHashPoupupOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rewardsTransferTxHash: '',
    },
  })

  const {mutate: addContestRewardsTransferTxHashMutate} =
    useAddContestRewardsTransferTxHash()

  const addRewardsTransferTxHash = ({rewardsTransferTxHash}: FormValues) => {
    addContestRewardsTransferTxHashMutate(
      {
        contestId: contest.id,
        rewardsTransferTxHash,
      },
      {
        onSuccess: () => {
          setIsAddTxHashPoupupOpen(false)
          toast({
            title: 'Success',
            description: 'Rewards transfer TX Hash added.',
          })
        },
      },
    )
  }

  return (
    <div className="mt-12 xl:mx-[340px]">
      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Links to the Github repository
        </h3>
        <Link href={contest.repoUrl} className="flex gap-3">
          <span>GitHub Repository</span>
          <LinkIcon width={24} height={24} />
        </Link>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Scope definition</h3>
        {contest.filesInScope.map((fileUrl) => (
          <Link href={contest.repoUrl} key={fileUrl} className="flex gap-3">
            <span>{fileUrl}</span>
            <LinkIcon width={24} height={24} />
          </Link>
        ))}
      </div>

      {showRewardsAmount && (
        <div className="mb-12 flex flex-col gap-3">
          <h3 className="text-bodyL text-purple-light">
            Total rewards (in ADA)
          </h3>
          <p className="text-bodyM">
            {formatAda(contest.rewardsAmount, 2, false)}
          </p>
        </div>
      )}

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Description</h3>
        <MarkdownPreview
          className="border-none px-0 py-0 text-bodyM"
          doc={contest.description}
        />
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Severity Rewards</h3>
        <ContestSeverityWeightsDisplay
          info={contest.contestSeverityWeights?.info}
          low={contest.contestSeverityWeights?.low}
          medium={contest.contestSeverityWeights?.medium}
          high={contest.contestSeverityWeights?.high}
          critical={contest.contestSeverityWeights?.critical}
        />
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">Custom conditions</h3>
        <p className="text-bodyM">{contest.customConditions || '-'}</p>
      </div>

      <div className="mb-12 flex flex-col gap-3">
        <h3 className="text-bodyL text-purple-light">
          Rewards Transfer TX Hash
        </h3>
        {contest.rewardsTransferTxHash ? (
          <Button variant="link" asChild className="justify-start">
            <Link
              href={`https://cardanoscan.io/transaction/${contest.rewardsTransferTxHash}`}>
              {contest.rewardsTransferTxHash}
            </Link>
          </Button>
        ) : (
          <p className="text-bodyM">-</p>
        )}
      </div>

      {session?.user.role !== UserRole.JUDGE &&
        contest.status === ContestStatus.PENDING && (
          <DialogRoot
            open={isAddTxHashPoupupOpen}
            onOpenChange={setIsAddTxHashPoupupOpen}>
            <DialogTrigger>
              <Button variant="outline" className="flex gap-3">
                <span className="uppercase">
                  {contest.rewardsTransferTxHash ? 'Edit' : 'Add'} rewards
                  transfer tx hash
                </span>
              </Button>
            </DialogTrigger>

            <DialogContent className="border-0 bg-grey-90">
              <Form {...form} onSubmit={addRewardsTransferTxHash}>
                <DialogHeader>
                  <DialogTitle className="text-titleM uppercase">
                    {contest.rewardsTransferTxHash ? 'Edit' : 'Add'} rewards
                    transfer TX Hash
                  </DialogTitle>
                  <DialogDescription className="text-bodyM text-white">
                    Provide the TX hash of the rewards transfer. Please make
                    sure the transfer address is correct.
                  </DialogDescription>
                </DialogHeader>

                <div>
                  <span>Rewards transfer address</span>
                  <p className="font-bol mt-2 break-all bg-black p-4">
                    {contest.rewardsTransferAddress}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="rewardsTransferTxHash"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Rewards transfer tx hash</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full justify-end">
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            </DialogContent>
          </DialogRoot>
        )}

      <ContestInfoJudge contest={contest} />
    </div>
  )
}

export default ContestInfo
