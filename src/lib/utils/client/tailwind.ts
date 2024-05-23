import {type ClassValue, clsx} from 'clsx'
import {extendTailwindMerge, validators} from 'tailwind-merge'

const customFontSizes = [
  'buttonS',
  'buttonM',
  'buttonL',
  'bodyS',
  'bodyM',
  'bodyL',
  'titleS',
  'titleM',
  'titleL',
  'headlineS',
  'headlineM',
  'headlineL',
  'displayS',
  'displayM',
  'displayL',
]

const twMerge = extendTailwindMerge<never, 'font-size'>({
  extend: {
    theme: {
      'font-size': customFontSizes,
    },
    classGroups: {
      'font-size': [
        {
          text: [
            'base',
            validators.isTshirtSize,
            validators.isArbitraryLength,
            ...customFontSizes,
          ],
        },
      ],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}
