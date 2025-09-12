## EVITA Inventory Manager – Next.js App

Server-rendered inventory manager for labs, storage locations, devices, and movements. Uses Prisma with MS SQL Server.

### Prerequisites

- Node.js 18+
- PNPM or NPM
- Docker (for MS SQL Server) or a reachable MS SQL Server instance

### 1) Clone the repo

```bash
git clone <your-repo-url>
cd inventorymanager
```

### 2) Install dependencies

With PNPM (recommended):

```bash
pnpm install
```

Or with NPM:

```bash
npm install
```

This installs Prisma and `@prisma/adapter-mssql`.

### 3) Start MS SQL Server (Docker)

```bash
docker run -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=YourStrongPassw0rd" \
  -p 1433:1433 \
  --name evita-mssql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Create DB (example: `EvitaInventoryDB`):

```bash
docker exec -it evita-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrongPassw0rd -Q "CREATE DATABASE EvitaInventoryDB;"
```

### 4) Environment for Prisma CLI

Create `.env` with a SQL Server URL for Prisma CLI operations:

```env
DATABASE_URL="sqlserver://sa:YourStrongPassw0rd@localhost:1433;database=EvitaInventoryDB;trustServerCertificate=true;encrypt=false"
```

### 5) Generate Prisma client and sync schema

```bash
pnpm prisma generate
pnpm prisma db push
```

or with NPM:

```bash
npx prisma generate
npx prisma db push
```

Note: The Prisma client output is configured to `src/generated/prisma`. Import it in code as:

```ts
import { PrismaClient } from "@/generated/prisma";
```

At runtime, Prisma uses the MS SQL adapter configured in `src/lib/prisma.ts` similar to:

```ts
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "@/generated/prisma";

const adapter = new PrismaMssql({
  server: "localhost",
  port: 1433,
  database: "EvitaInventoryDB",
  user: "sa",
  password: "YourStrongPassw0rd",
  options: { encrypt: false, trustServerCertificate: true },
});

export const prisma = new PrismaClient();
```

### 6) Run the app

```bash
pnpm dev
# or
npm run dev
```

Visit http://localhost:3000

### Troubleshooting

- "@prisma/client did not initialize yet" → Import from `@/generated/prisma` and run `prisma generate`.
- Connection issues → Ensure Docker container is running and credentials in `.env` and `src/lib/prisma.ts` match.
- Prisma CLI requires `DATABASE_URL` even when using the adapter at runtime.

### Common commands

```bash
pnpm install
pnpm prisma generate
pnpm prisma db push
pnpm dev
```
