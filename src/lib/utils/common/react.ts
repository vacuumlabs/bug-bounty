import {ReactNode, Ref, RefAttributes, forwardRef} from 'react'

export const genericForwardRef = <T, P = Record<string, unknown>>(
  render: (props: P, ref: Ref<T>) => ReactNode,
): ((props: P & RefAttributes<T>) => ReactNode) =>
  forwardRef(render) as (props: P & RefAttributes<T>) => ReactNode
