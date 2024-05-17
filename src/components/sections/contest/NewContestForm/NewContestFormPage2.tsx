import {DateTime} from 'luxon'

import {type NewContestFormPageProps} from './NewContestForm'
import SeverityWeightsSelect from './SeverityWeightsSelect'

import DateTimeInput from '@/components/ui/DateTimeInput'
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

export const page2fields = [
  'rewardsAmount',
  'severityWeights',
  'customConditions',
  'timezone',
  'startDate',
  'endDate',
] as const

const NewContestFormPage2 = ({form}: NewContestFormPageProps) => {
  const {control, watch} = form

  return (
    <div className="flex flex-col gap-5">
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
            <FormDescription>
              Rewards are based on a share of the total reward pool. The actual
              amounts will be calculated once the contest ends.
            </FormDescription>
            <FormControl>
              <SeverityWeightsSelect
                weights={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
              />
            </FormControl>
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
            <FormDescription>
              Have a special case? Write it down here! Whether it’s something
              unique, an exception, or a one-of-a-kind situation, this is where
              you can note it all.
            </FormDescription>
            <FormControl>
              <Input {...field} />
            </FormControl>
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
      <div className="flex gap-4">
        <FormField
          control={control}
          name="startDate"
          render={({field}) => (
            <FormItem>
              <FormLabel>Start</FormLabel>
              <FormControl>
                <DateTimeInput
                  zonename={watch('timezone') ?? undefined}
                  min={DateTime.now().set({millisecond: 0, second: 0}).toISO({
                    includeOffset: false,
                  })}
                  {...field}
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
                <DateTimeInput
                  zonename={watch('timezone') ?? undefined}
                  min={DateTime.now().set({millisecond: 0, second: 0}).toISO({
                    includeOffset: false,
                  })}
                  {...field}
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
