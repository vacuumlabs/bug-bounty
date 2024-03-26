'use client'

import {ReactNode, useEffect, useLayoutEffect, useState} from 'react'

// implementation taken from MUI NoSsr component

type NoSSRProps = {
  children: ReactNode
  defer?: boolean
  fallback?: ReactNode
}

const useEnhancedEffect =
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'test'
    ? useLayoutEffect
    : useEffect

const NoSSR = ({children, defer, fallback}: NoSSRProps) => {
  const [isMounted, setIsMounted] = useState(false)

  useEnhancedEffect(() => {
    if (!defer) {
      setIsMounted(true)
    }
  }, [defer])

  useEffect(() => {
    if (defer) {
      setIsMounted(true)
    }
  }, [defer])

  return isMounted ? children : fallback
}

export default NoSSR
