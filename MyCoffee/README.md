# BrewLog Coffee Companion

BrewLog is a modern web application designed to help coffee enthusiasts track their caffeine intake, discover new recipes, and perfect their brewing techniques.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk.com
- **Database**: Supabase
- **Deployment**: Vercel

## Features

- User authentication with Clerk.com
- Coffee consumption logging
- Recipe management
- Brew guides with interactive timers
- Dashboard with statistics and personalized recommendations

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Clerk.com account
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brewlog.git
cd brewlog
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env.local
```

4. Add your Clerk.com and Supabase credentials to the `.env.local` file

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

To set up the Supabase database, run the migration file located in `/supabase/migrations`:

1. Connect to your Supabase project
2. Run the migration file to create the initial tables

## Project Structure

- `/app` - Next.js application routes
- `/components` - React components
- `/lib` - Utility functions and types
- `/supabase` - Supabase configuration and migrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.