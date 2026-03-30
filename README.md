# Smart Inventory & Order Management

Inventory and order operations dashboard built with Next.js App Router and TypeScript.

## Features

### Authentication

- Signup and login with email/password
- JWT auth in HTTP-only cookies
- Route protection via middleware

### Product and Category Management

- Create, update, and delete products
- Create and delete categories
- Product status tracking (`active`, `out_of_stock`)
- Low-stock indicators and restock awareness

### Order Management

- Create multi-item orders
- Order lifecycle: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- Automatic stock deduction on order create
- Stock restoration on cancellation

### Conflict Detection

- Prevent duplicate product entries in the same order
- Prevent ordering unavailable products
- Clear validation messages such as:
  - `This product is already added to the order.`
  - `"<product-name>" is currently unavailable.`

### Restock Queue

- Auto-add low-stock products to queue
- Priority levels (`high`, `medium`, `low`)
- Manual restock and queue removal actions

### Dashboard and Activity

- KPI cards for orders, pending count, low stock, and revenue
- Revenue chart for recent trend
- Activity feed with paginated Activity Log view

### Quality of Life

- Search/filter for products and orders
- Pagination for products, orders, and activity logs

## Tech Stack

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Framework        | Next.js 16 (App Router)                          |
| Language         | TypeScript                                       |
| UI               | Tailwind CSS v4, Base UI/shadcn-style components |
| Forms/Validation | Formik, Zod                                      |
| Client Data      | SWR                                              |
| Local State      | Zustand                                          |
| Auth             | jose, bcryptjs                                   |
| Database         | MongoDB (`mongodb` driver)                       |
| Charts           | Recharts                                         |

## Setup

### Prerequisites

- Node.js 20+
- npm
- MongoDB Atlas (or any MongoDB URI)

### 1. Install dependencies

```bash
cd smart-inventory
npm install
```

### 2. Create `.env`

Create a file named `.env` in the project root:

```env
JWT_SECRET=change-this-in-production
MONGODB_URI=your-mongodb-connection-string
MONGODB_DB_NAME=smart_inventory
DB_PATH=./data/db.json
PORT=3000
```

Notes:

- `MONGODB_URI` is required for runtime persistence.
- `DB_PATH` is used as legacy/local seed fallback data source.

### 3. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Data and Seeding

- The app stores runtime data in MongoDB collection `app_state` as a singleton document (`_id: "singleton"`).
- On first read, if Mongo has no app document yet, it seeds from `data/db.json`.
- You can also manually reseed by writing `data/db.json` into Mongo (as done during setup tasks).

## Build and Run

```bash
npm run build
npm run start
```

## Deployment Notes

- Configure `JWT_SECRET`, `MONGODB_URI`, and `MONGODB_DB_NAME` in your hosting environment.
- For MongoDB Atlas, whitelist your deployment/server IP(s) in Atlas Network Access.
- Avoid `0.0.0.0/0` outside temporary development use.

## Project Structure

```text
src/
   app/
      (auth)/
      (app)/
      api/
   components/
   hooks/
   lib/
   store/
   types/
data/
   db.json
middleware.ts
```
