import {faker} from '@faker-js/faker'

import {env} from '@/env'

export const TEST_WALLET_ADDRESS =
  env.SEED_WALLET_ADDRESS ??
  `addr_test${faker.string.alphanumeric({casing: 'lower', length: 99})}`
