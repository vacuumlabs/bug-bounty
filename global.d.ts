declare module '*.svg' {
  import {StaticImageData} from 'next/image'

  const content: StaticImageData // Next.js treats SVGs as static assets
  export default content
}
