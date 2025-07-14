# replit.md

## Overview

This is a modern full-stack web application called "وشك بكام؟" (FaceScore), inspired by early Facebook's FaceMash concept. It's a platform where users can add people (with photos and descriptions), rate them on a 1-5 star scale, leave comments, and participate in head-to-head comparisons. The application features a cyberpunk-themed dark UI with Arabic language support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom cyberpunk theme variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast bundling

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: @neondatabase/serverless driver

## Key Components

### Core Data Models
1. **People**: Main entities with name, description, category, image, ratings, and comments count
2. **Ratings**: 1-5 star ratings linked to people
3. **Comments**: Text comments on people
4. **FaceMash Votes**: Head-to-head comparison votes for the FaceMash feature

### Application Pages
1. **Home Page** (`/`): Browse people by category, view top-rated individuals
2. **Person Detail** (`/person/:id`): View individual profiles with ratings and comments
3. **FaceMash** (`/facemash`): Side-by-side comparison voting interface

### Key Features
- **Rating System**: 5-star rating with automatic title assignment based on average score
- **Category Filtering**: People can be categorized (professors, students, employees, celebrities, etc.)
- **Comment System**: Anonymous commenting on profiles
- **FaceMash Mode**: Binary comparison voting between random people
- **Responsive Design**: Mobile-first design with cyberpunk aesthetic

## Data Flow

1. **Person Creation**: Users submit person data through modal form → validated with Zod → stored in database
2. **Rating Flow**: Users select star rating → submitted to API → person's average rating updated
3. **Comment Flow**: Users write comments → submitted to API → stored and displayed on person's profile
4. **FaceMash Flow**: Random people pairs fetched → user votes → vote recorded → new pair generated

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Library**: Radix UI components for accessibility
- **Validation**: Zod for runtime type checking and validation
- **Date Handling**: date-fns for date formatting
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing with autoprefixer
- **ESLint/Prettier**: Code quality and formatting (implied)

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for direct TypeScript execution
- **Database**: Drizzle Kit push for schema synchronization

### Production Build
- **Frontend**: Vite build → static assets in `dist/public`
- **Backend**: esbuild bundle → single JS file in `dist`
- **Deployment**: Node.js server serving both API and static files
- **Environment**: Production mode with NODE_ENV=production

### Database Management
- Drizzle migrations stored in `./migrations` directory
- Schema definitions in `shared/schema.ts` for type sharing
- Connection via DATABASE_URL environment variable

The application uses a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The cyberpunk theme and Arabic language support make it culturally specific while maintaining modern web development practices.