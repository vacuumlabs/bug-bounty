import {QueryClient} from '@tanstack/react-query'
import {cache} from 'react'

const getServerQueryClient = cache(() => new QueryClient())

export default getServerQueryClient
