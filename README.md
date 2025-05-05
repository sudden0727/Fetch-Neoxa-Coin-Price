# Neoxa Price Tracker

A TypeScript-based Express.js application that fetches real-time Neoxa (NEOXA) price data from CoinMarketCap. The price is automatically updated every 5 minutes and stored in a PostgreSQL database.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your configuration:
```
CMC_API_KEY=your_coinmarketcap_api_key_here
PORT=3000
DATABASE_URL="postgresql://username:password@localhost:5432/neoxa_price_db"
```

3. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Development mode:
```bash
npm run dev
```

5. Production build:
```bash
npm run build
npm start
```

## Features

- Automatically fetches Neoxa price every 5 minutes
- Stores price history in PostgreSQL database
- Caches the latest price data for quick access
- Provides real-time price updates via API endpoint
- TypeScript-based for better type safety and development experience

## API Endpoints

- GET `/api/neoxa-price`: Returns the current cached price and last update time of Neoxa in USD
- GET `/api/neoxa-price/history`: Returns the price history (default: last 100 entries)

## Response Format

### Current Price
```json
{
    "price": 0.123456,
    "last_updated": "2024-04-09T12:34:56.789Z"
}
```

### Price History
```json
[
    {
        "id": 1,
        "price": 0.123456,
        "timestamp": "2024-04-09T12:34:56.789Z",
        "createdAt": "2024-04-09T12:34:56.789Z",
        "updatedAt": "2024-04-09T12:34:56.789Z"
    }
]
```

## Requirements

- Node.js
- TypeScript
- PostgreSQL database
- CoinMarketCap API key (Pro API key required)

## Project Structure

```
├── src/
│   └── index.ts         # Main application file
├── prisma/
│   └── schema.prisma    # Database schema
├── dist/                # Compiled JavaScript files
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
``` 