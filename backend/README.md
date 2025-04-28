
# Lost and Found Backend API

This is the backend API for the Lost and Found platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your PostgreSQL database credentials.

4. Start the server:
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Items

- **POST /api/items** - Create a new lost/found item
- **GET /api/items** - Get all items (with optional filters)
- **GET /api/items/:id** - Get a single item by ID
- **PUT /api/items/:id** - Update an item
- **DELETE /api/items/:id** - Delete an item
- **GET /api/items/:id/matches** - Find potential matches for an item

### File Upload

- **POST /api/upload/image** - Upload an image

## Query Parameters for GET /api/items

- `itemType`: Filter by 'lost' or 'found'
- `category`: Filter by item category
- `query`: Search in title, description, and location
- `startDate`: Filter items after this date (YYYY-MM-DD)
- `endDate`: Filter items before this date (YYYY-MM-DD)

## Database Initialization

The server will automatically create the tables on first run based on the defined models.
