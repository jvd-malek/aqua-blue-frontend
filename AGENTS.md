<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project Structure

This is a Next.js 13+ App Router project with the following key directories:
- `app/` - Main application pages and routes (using App Router)
- `components/` - Reusable React components
- `lib/` - Utility functions and custom hooks (including client-swr for API calls)
- `store/` - State management (Zustand)
- `hooks/` - Custom React hooks

## Key Technologies

- Framework: Next.js 16.2.6 with App Router
- State Management: Zustand (store/) and SWR (lib/client-swr.ts)
- UI Components: React + Tailwind CSS
- Testing: Vitest with JSDOM
- Linting: ESLint with Next.js configuration

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Important Implementation Details

- API calls are made through `lib/client-swr.ts` which handles authentication with credentials: 'include'
- Environment variables are accessed via `process.env.NEXT_PUBLIC_API_URL` 
- The app uses RTL (right-to-left) Persian language layout
- All API endpoints are prefixed with the configured API URL
- Authentication uses a phone-based login flow with code verification
- Client-side data fetching uses SWR for caching and revalidation

## Testing

- Unit/integration tests use Vitest with JSDOM
- Test files are typically colocated with the code they test
- No explicit test runner configuration found beyond standard Next.js setup

## Deployment

- Deploy on Vercel (standard Next.js deployment workflow)
- Uses standard Next.js build process
