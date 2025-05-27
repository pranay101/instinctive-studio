# B2B Marketplace Prototype

A modern B2B marketplace where buyers can search and filter through a large catalogue of business listings. Built with Next.js, Prisma, and MongoDB.

## Features

- 🔍 Full-text search with category-specific filters
- 🏷️ Dynamic attribute-based filtering
- 📱 Responsive design with modern UI
- 🔄 Real-time search and filter updates
- 📊 Efficient data modeling with proper indexing
- 🛠️ Type-safe API endpoints with Zod validation

## Prerequisites

- Node.js (v18 or later)
- MongoDB (v6 or later)
- npm or yarn

## Environment Setup

1. Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="mongodb://localhost:27017/b2b-marketplace"
   ```

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd coding-challenge
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Generate Prisma client**

   ```bash
   npx prisma generate
   ```

4. **Push the database schema**

   ```bash
   npx prisma db push
   ```

5. **Seed the database**

   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
coding-challenge/
├── app/                    # Next.js 13 app directory
│   ├── api/               # API routes
│   │   ├── categories/    # Category-related endpoints
│   │   └── search/        # Search and filter endpoints
│   └── page.tsx           # Main page component
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## API Documentation

### Search Endpoint

`GET /api/search`

Query Parameters:

- `q` (optional): Search query
- `category` (optional): Category slug
- `offset` (optional): Pagination offset (default: 0)
- `limit` (optional): Results per page (default: 10)
- `filters` (optional): JSON string of attribute filters

### Categories Endpoint

`GET /api/categories`

Returns all available categories with their attributes.

### Category Attributes Endpoint

`GET /api/categories/attributes?category=<slug>`

Returns attributes and possible values for a specific category.

## Development

### Code Style

- Use TypeScript for type safety
- Follow the existing component structure
- Add proper error handling and loading states
- Include comments for complex logic

### Testing

Run the test suite:

```bash
npm test
```

### Database Management

- Use Prisma Studio to view/edit data:
  ```bash
  npx prisma studio
  ```
- Reset the database:
  ```bash
  npx prisma db push --force-reset
  ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
