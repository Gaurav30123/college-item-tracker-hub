
# Lost and Found Platform

This is a full-stack application for a Campus Lost and Found system.

## Frontend

The frontend is built with:
- React
- TypeScript
- React Router
- React Query
- Tailwind CSS
- Shadcn UI components

## Backend

The backend is built with:
- Node.js
- Express
- PostgreSQL with Sequelize ORM

## Setup Instructions

### Frontend

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your PostgreSQL database credentials.

5. Start the backend server:
```bash
npm run dev
```

## Features

- Report lost and found items
- Search and filter items
- View item details
- Upload images of items
- Match lost items with found items
- Claim items

## Database Setup

The application uses PostgreSQL. You need to create a database named `lost_and_found` (or update the name in your `.env` file).

The tables will be automatically created by Sequelize when you start the backend server for the first time.

## GitHub Integration

To push this project to GitHub:

1. Create a new repository on GitHub
2. Initialize Git in your project folder:
```bash
git init
```
3. Add all files to staging:
```bash
git add .
```
4. Commit the files:
```bash
git commit -m "Initial commit"
```
5. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```
6. Push to GitHub:
```bash
git push -u origin main
```
