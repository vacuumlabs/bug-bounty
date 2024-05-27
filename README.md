This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies:

```bash
yarn install
```

Copy `.env` file and add secrets to `.env.local`:

```bash
cp .env.local.example .env.local
```

Run postgres locally using docker:

```bash
./start-database.sh
```

Push schema to DB:

```bash
yarn db:push
```

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Tech stack and design decisions

- DrizzleOrm - new popular ORM library, good Typesript support, can be used both as a query builder and ORM
- Next.js Server actions - removes a ton of boilerplate (request handling), we would otherwise have to write when using API Route handlers
- React Query - good for handling mutations - pending state, onSuccess and onError callbacks, integrates well with server actions, great for combined actions like `addWalletAddress`, that have both client-side and server-side parts
- Data fetching - deciding between querying the data in async server components (the Next.js way) or wrapping it with React Query. Querying the data in server components makes it difficult to revalidate due to Next.js heavy use of caching. The `revalidateTag` only works with `fetch` (Route handlers) and not when querying the DB directly in the server actions. Using `revalidatePath` doesn't seem like a good long-term solution as we'd have to keep track of all the screens where certain data is used. Wrap data fetching functions with `unstable_cache` would allow assigning revalidation tags to them, however it's still experimental and it's unclear, how composed revalidation tags / keys would work. On the other hand, React Query provides granular control over data revalidation although it adds some overhead - need to split components into server and client parts and wrap the client part with `HydrationBoundary`.
- Shadcn - collection of accessible component templates, can be copied into our codebase with the CLI, good compromise between writing our own custom components and using some black-box component library

# Architecture Diagram

![use-as-template](https://raw.githubusercontent.com/vacuumlabs/bug-bounty/8a496f6ce64dcd3f5721e078c866996efbef824d/architecture-diagram.png)
