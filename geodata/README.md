# Geodata API

Small Express + MongoDB API for storing geodata and optionally pulling live weather data by coordinates.

## Requirements

- Node.js 18+ (uses built-in `fetch`)
- MongoDB running locally or reachable by URI

## Setup

1. Install dependencies:
```bash
npm install
```
2. Create/update `.env` in `geodata/`:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/geodata-demo
```
3. Start the app:
```bash
npm run dev
```
or
```bash
npm start
```

## Base URL

`http://localhost:3000`

## Routes

### `GET /`
- Health/root endpoint.
- Returns a simple message plus request metadata.

### `GET /geodata`
- If `lat` and `lon` are provided:
  - Calls OpenWeatherMap for those coordinates.
  - Stores selected weather fields in MongoDB.
  - Returns the created record ID.
- If `lat`/`lon` are not provided:
  - Returns stored geodata documents.
  - Supports pagination, sorting, and basic filter operators.

Supported query params:
- `page` (default `1`)
- `limit` (default `10`)
- `sort` (example: `sort=latitude,-createdAt`)
- filters (including `gt`, `gte`, `lt`, `lte`, `in` style operators)

### `GET /geodata/:id`
- Returns one geodata record by MongoDB ID.

### `POST /geodata`
- Creates a geodata record from JSON request body.

### `PATCH /geodata/:id`
- Updates a geodata record by ID and returns the updated document.

### `DELETE /geodata/:id`
- Deletes a geodata record by ID.

## Example Requests

### Get All Stored Geodata
```bash
curl "http://localhost:3000/geodata"
```

### Get All with Pagination + Sorting
```bash
curl "http://localhost:3000/geodata?page=1&limit=5&sort=latitude,-createdAt"
```

### Get All with Filters
```bash
curl "http://localhost:3000/geodata?visibility[gte]=5000&latitude[lt]=40"
```

### Fetch Live Weather by Coordinates (and Store It)
```bash
curl "http://localhost:3000/geodata?lat=41.5868&lon=-93.6250"
```

### Get One by ID
```bash
curl http://localhost:3000/geodata/<GEODATA_ID>
```

### Delete Geodata
```bash
curl -X DELETE http://localhost:3000/geodata/<GEODATA_ID>
```

## Notes

- Weather lookup currently uses an API key defined in `app/getWeather.js`.
- For production, move that key into environment variables and avoid hardcoding secrets.

## Rate limiting
Handled via express-rate-limit. Config in index.js. Test by setting limit to 1 and hitting two requests back to back.