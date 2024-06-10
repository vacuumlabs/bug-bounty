export type Nullable<T> = {
  [K in keyof T]: T[K] | null
}

export type Override<T, K> = Omit<T, keyof K> & K

export type Merge<A, B> = Omit<A, keyof B> &
  Omit<B, keyof A> & {
    [K in keyof (A | B)]: A[K] | B[K]
  }

export type SearchParams = Record<string, string | string[] | undefined>
