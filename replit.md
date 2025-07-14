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
1. **People**: Enhanced entities with name, description, category, image, ratings, comments count, view count, FaceMash wins/losses, and verification status
2. **Ratings**: 1-5 star ratings linked to people with automatic average calculation
3. **Comments**: Anonymous text comments with timestamps
4. **FaceMash Votes**: Head-to-head comparison votes with automatic win/loss tracking

### Application Pages
1. **Home Page** (`/`): Browse people by category, view top-rated individuals
2. **Person Detail** (`/person/:id`): View individual profiles with ratings and comments
3. **FaceMash** (`/facemash`): Side-by-side comparison voting interface

### Key Features
- **Advanced Rating System**: 5-star rating with detailed title assignment based on average score (9 different levels from "جديد" to "إمبراطور مطلق")
- **Smart Search**: Real-time search functionality across names, descriptions, and categories
- **Category Filtering**: People can be categorized (professors, students, employees, celebrities, etc.)
- **Anonymous Comment System**: Full commenting system with timestamps and anonymous user identification
- **FaceMash Mode**: Binary comparison voting between random people with win/loss tracking
- **Advanced Statistics**: Comprehensive site-wide and individual user statistics including view counts, win rates, and popularity metrics
- **Sample Data**: Pre-loaded with Egyptian-themed sample data for demonstration
- **Responsive Design**: Mobile-first design with cyberpunk aesthetic and enhanced animations

## Data Flow

1. **Person Creation**: Users submit person data through modal form → validated with Zod → stored in database with initial statistics
2. **Rating Flow**: Users select star rating → submitted to API → person's average rating and count updated → rating title automatically assigned
3. **Comment Flow**: Users write anonymous comments → submitted to API → stored with timestamps → comment count updated
4. **FaceMash Flow**: Random people pairs fetched → user votes → vote recorded → win/loss stats updated → new pair generated
5. **Search Flow**: User types query → real-time search across all person fields → results sorted by rating
6. **Statistics Tracking**: Every page view, rating, comment, and vote automatically updates comprehensive site and individual statistics

## Recent Updates (January 2025)

### Major Enhancements Added:
- **Comprehensive Search System**: Real-time search with result highlighting and smart filtering
- **Enhanced Statistics**: View counts, win rates, popularity metrics, and site-wide analytics dashboard
- **Improved Rating Titles**: 9-level rating system with more nuanced Egyptian humor titles
- **Sample Data Integration**: Pre-loaded demonstration data with authentic Egyptian names and descriptions
- **Advanced UI Features**: Enhanced person detail pages with statistics cards and improved visual hierarchy
- **Performance Improvements**: Fixed TypeScript errors and optimized database operations

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