# Technology Stack

This document outlines the chosen technologies for the Packing List application.

- **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
- **API Layer:** [tRPC](https://trpc.io/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Icons:** [Lucide Icons (`lucide-react`)](https://lucide.dev/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Unit/Integration Testing:** [Vitest](https://vitest.dev/)
- **End-to-End (E2E) Testing:** [Playwright](https://playwright.dev/)
- **Weather API:** [OpenWeatherMap](https://openweathermap.org/api) (initial choice, subject to change during implementation)
- **Client-Side State (Ephemeral List):** [Zustand](https://github.com/pmndrs/zustand) (using `persist` middleware for local storage)
- **Deployment:** [Vercel](https://vercel.com/)
