'use client'

import {MeshProvider} from '@meshsdk/react'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import {SessionProvider} from 'next-auth/react'
import {ReactNode} from 'react'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

import {handleGeneralError} from '@/lib/utils/error'

type ProvidersProps = {
  children: ReactNode
}

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
      mutations: {
        // This way it's overrideable in useMutation hooks
        onError: handleGeneralError,
      },
    },
    queryCache: new QueryCache({
      onError: handleGeneralError,
    }),
  })
}

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient()
    }
    return browserQueryClient
  }
}

const Providers: React.FC<ProvidersProps> = ({children}) => {
  const queryClient = getQueryClient()

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <MeshProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </MeshProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default Providers
