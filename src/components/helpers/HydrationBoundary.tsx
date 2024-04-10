import {
  HydrationBoundary as RQHydrationBoundary,
  dehydrate,
} from '@tanstack/react-query'

import getServerQueryClient from '@/server/utils/queryClient'

type HydrationBoundaryProps = {
  children: React.ReactNode
}

const HydrationBoundary = ({children}: HydrationBoundaryProps) => {
  const queryClient = getServerQueryClient()

  return (
    <RQHydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </RQHydrationBoundary>
  )
}

export default HydrationBoundary
