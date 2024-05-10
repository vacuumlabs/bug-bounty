import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import {loadEnv} from 'vite'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'node',
    env: loadEnv('', process.cwd(), ''),
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
})
