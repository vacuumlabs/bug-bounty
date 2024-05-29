import {type NewContestFormPageProps} from './NewContestForm'
import GithubRepoSelect from '../../github/GithubRepoSelect'
import GithubFileSelect from '../../github/GithubFileSelect'
import GithubBranchSelect from '../../github/GithhubBranchSelect'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form'
import {Input} from '@/components/ui/Input'
import MarkdownEditor from '@/components/markdown/MarkdownEditor'
import {CheckboxGroup} from '@/components/ui/Checkbox'
import {selectOptions} from '@/lib/utils/common/enums'

export const page1fields = [
  'title',
  'repository',
  'filesInScope',
  'projectCategory',
  'projectLanguage',
  'description',
] as const

const NewContestFormPage1 = ({form}: NewContestFormPageProps) => {
  const {control, watch, setValue} = form

  const selectedRepo = watch('repository')
  const selectedBranch = watch('repoBranch')

  return (
    <div className="flex flex-col gap-12">
      <FormField
        control={control}
        name="title"
        render={({field}) => (
          <FormItem>
            <FormLabel>What is the name of your project?</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="repository"
        render={({field}) => (
          <FormItem>
            <FormLabel>Link your Github repository</FormLabel>
            <FormControl>
              <GithubRepoSelect
                selectedRepo={field.value}
                onSelectRepo={(repo) => {
                  field.onChange(repo)
                  setValue('filesInScope', [])
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {selectedRepo && (
        <FormField
          control={control}
          name="repoBranch"
          disabled={!selectedRepo}
          render={({field}) => (
            <FormItem>
              <FormLabel>Select the repo branch to use</FormLabel>
              <FormControl>
                <GithubBranchSelect
                  selectedRepo={selectedRepo}
                  selectedBranch={field.value}
                  onSelectBranch={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {selectedRepo && selectedBranch && (
        <FormField
          control={control}
          name="filesInScope"
          disabled={!selectedRepo}
          render={({field}) => (
            <FormItem>
              <FormLabel>Scope definition</FormLabel>
              <FormControl>
                <GithubFileSelect
                  selectedRepo={selectedRepo}
                  selectedBranch={selectedBranch}
                  selectedFiles={field.value}
                  onSelectFiles={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Select, which files from the Github repository should be
                considered in scope.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={control}
        name="projectCategory"
        render={({field: {ref, ...field}}) => (
          <FormItem>
            <FormLabel>Project type</FormLabel>
            <FormControl>
              <CheckboxGroup
                options={selectOptions.projectCategory}
                className="flex-row flex-wrap gap-6"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="projectLanguage"
        render={({field: {ref, ...field}}) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <CheckboxGroup
                options={selectOptions.projectLanguage}
                className="flex-row flex-wrap gap-6"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({field}) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <MarkdownEditor {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export default NewContestFormPage1
