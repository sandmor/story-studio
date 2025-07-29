# Story Studio

Story Studio is a web application for creating and managing story timelines. It allows users to create characters and events, and visualize them on a timeline.

## Features

- **Authentication:** Users can sign in with their Clerk account.
- **Project Management:** Users can create and manage projects.
- **Character Management:** Users can create, update, and delete characters within a project.
- **Event Management:** Users can create, update, and delete events within a project.
- **Timeline Visualization:** Users can visualize the timeline of events for each project.

## Getting Started

To get started with Story Studio, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/story-studio.git
   ```
2. **Install the dependencies:**
   ```bash
   pnpm install
   ```
3. **Set up your environment variables:**
   Copy the `.env.local.example` file to a new file named `.env.local` and add the required environment variables.
   ```bash
   cp .env.local.example .env.local
   ```
   You can get these values from your Clerk and Convex dashboards. The `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` is the Issuer URL from your Clerk JWT template.
4. **Run the development server:**
   ```bash
   pnpm dev
   ```
5. **Open the application in your browser:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Convex](https://www.convex.dev/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
