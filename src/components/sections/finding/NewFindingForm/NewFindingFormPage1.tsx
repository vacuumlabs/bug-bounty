import {useMemo} from 'react'

import {type NewFindingFormPageProps} from './NewFindingForm'
import FindingSeverityButtonSelect from './FindingSeverityButtonSelect'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import {CheckboxGroup} from '@/components/ui/Checkbox'
import {AsyncCombobox} from '@/components/ui/Combobox'
import {ContestOccurence} from '@/server/db/models'
import {useGetPublicContests} from '@/lib/queries/contest/getPublicContests'
import Separator from '@/components/ui/Separator'
import {useGetContest} from '@/lib/queries/contest/getContest'

export const page1fields = [
  'rewardWalletAddress',
  'contestId',
  'affectedFiles',
  'severity',
] as const

const useGetFilteredContests = (searchQuery: string) =>
  useGetPublicContests({
    type: ContestOccurence.PRESENT,

    searchQuery: searchQuery || undefined,
  })

const NewFindingFormPage1 = ({form}: NewFindingFormPageProps) => {
  const {control, setValue, watch} = form

  const contestId = watch('contestId')

  const {data: contest} = useGetContest(contestId ?? undefined, {
    enabled: !!contestId,
  })

  // TODO fetch all files in repo, if no specific "filesInScope" were selected
  const affectedFilesSelectOptions = useMemo(
    () =>
      contest?.filesInScope?.map((file) => ({
        value: file,
        label: file,
      })),
    [contest],
  )

  return (
    <div className="flex flex-col gap-12">
      <FormField
        control={control}
        name="rewardWalletAddress"
        render={({field}) => (
          <FormItem>
            <FormLabel>Address to receive rewards</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contestId"
        render={({field}) => (
          <FormItem>
            <FormLabel>Select a project</FormLabel>
            <FormControl>
              <AsyncCombobox
                value={field.value}
                onChange={(project) => {
                  field.onChange(project)
                  setValue('affectedFiles', [])
                }}
                useGetData={useGetFilteredContests}
                formatOption={(contest) => ({
                  value: contest.id,
                  label: contest.title,
                })}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!!affectedFilesSelectOptions && (
        <FormField
          key={contestId}
          control={control}
          name="affectedFiles"
          render={({field: {ref, ...field}}) => (
            <FormItem>
              <FormLabel>Affected files</FormLabel>
              <FormControl>
                <CheckboxGroup
                  options={affectedFilesSelectOptions}
                  className="gap-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="severity"
        render={({field: {ref, ...field}}) => (
          <FormItem className="space-y-6">
            <FormLabel>Choose the severity level</FormLabel>
            <Separator />
            <FormControl>
              <FindingSeverityButtonSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default NewFindingFormPage1
