import {DateTime} from 'luxon'

import {type NewContestFormPageProps} from './NewContestForm'
import SeverityWeightsSelect from './SeverityWeightsSelect'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import TimezoneSelect from '@/components/ui/TimezoneSelect'
import Textarea from '@/components/ui/Textarea'
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker'

export const page2fields = [
  'rewardsAmount',
  'severityWeights',
  'customConditions',
  'knownIssuesDescription',
  'timezone',
  'startDate',
  'endDate',
] as const

const NewContestFormPage2 = ({form}: NewContestFormPageProps) => {
  const {control, watch} = form

  return (
    <div className="flex flex-col gap-12">
      <FormField
        control={control}
        name="rewardsAmount"
        render={({field}) => (
          <FormItem>
            <FormLabel>{`Total Rewards (in ADA)`}</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="severityWeights"
        render={({field}) => (
          <FormItem>
            <FormLabel>Severity rewards</FormLabel>
            <FormControl>
              <SeverityWeightsSelect
                weights={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            </FormControl>
            <FormDescription>
              Rewards are based on a share of the total reward pool. The actual
              amounts will be calculated once the contest ends.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="customConditions"
        render={({field}) => (
          <FormItem>
            <FormLabel>Custom conditions</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              Have a special case? Write it down here! Whether it’s something
              unique, an exception, or a one-of-a-kind situation, this is where
              you can note it all.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="knownIssuesDescription"
        render={({field}) => (
          <FormItem>
            <FormLabel>Add known issues</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              Declare any known issues with your contracts here. It is crucial
              for maintaining fairness and transparency. These issues become
              ineligible for rewards during contests.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="timezone"
        render={({field}) => (
          <FormItem>
            <FormLabel>Time zone</FormLabel>
            <FormControl>
              <TimezoneSelect {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex justify-between">
        <FormField
          control={control}
          name="startDate"
          render={({field}) => (
            <FormItem>
              <FormLabel>Start</FormLabel>
              <FormControl>
                <DateTimePicker
                  zonename={watch('timezone') ?? undefined}
                  fromDate={DateTime.now()
                    .set({millisecond: 0, second: 0})
                    .toJSDate()}
                  nullDateText="Choose start date"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="endDate"
          render={({field}) => (
            <FormItem>
              <FormLabel>End</FormLabel>
              <FormControl>
                <DateTimePicker
                  zonename={watch('timezone') ?? undefined}
                  fromDate={DateTime.now()
                    .set({millisecond: 0, second: 0})
                    .toJSDate()}
                  nullDateText="Choose end date"
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default NewContestFormPage2
