# B2B Marketplace Prototype

This project is a prototype for a B2B marketplace where buyers can search a large catalogue of business listings.

## Prerequisites

- Node.js (v14 or later)
- MongoDB (running locally)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd coding-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start MongoDB**

   Ensure MongoDB is running locally on the default port (27017).

4. **Seed the database**

   ```bash
   npm run seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `pages/api/search.js`: API endpoint for search and filtering
- `pages/search.js`: Next.js page with search bar and filter panel
- `components/`: Reusable UI components
- `prisma/schema.prisma`: Data models
- `seed.js`: Script to populate the database with sample data

## Features

- Full-text search
- Dynamic filtering based on category-specific attributes
- Facet metadata for filtering

## Bonus Features

- Pagination
- Relevance sorting
- Skeleton loaders
- Error boundaries
