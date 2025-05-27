# B2B Marketplace Prototype

## Design Inspiration
This project's UI design is inspired by the Stella Ecommerce Website design on Dribbble: [Stella Ecommerce Website](https://dribbble.com/shots/25001090-Stella-Ecommerce-Website)

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
