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

### SQL Seed Script

```sql
-- Use the correct database
USE EvitaInventoryDB;
GO
DELETE FROM Movements;
DELETE FROM InventoryItems;
DELETE FROM StorageLocations;
DELETE FROM Labs;
DELETE FROM Users;
DELETE FROM Roles;
-- If you want to reset auto-increment IDs too (careful with real data)
DBCC CHECKIDENT ('Movements', RESEED, 0);
DBCC CHECKIDENT ('InventoryItems', RESEED, 0);
DBCC CHECKIDENT ('StorageLocations', RESEED, 0);
DBCC CHECKIDENT ('Labs', RESEED, 0);
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Roles', RESEED, 0);
GO

-- 1. Insert into Roles
-- Assuming Id is IDENTITY (autoincrement)
SET IDENTITY_INSERT Roles ON;
INSERT INTO Roles (Id, Name) VALUES
(1, 'Administrator'),
(2, 'Teacher'),
(3, 'Student');
SET IDENTITY_INSERT Roles OFF;
GO

-- 2. Insert into Users
-- Users depend on Roles
-- Note: 'N'' is the default you specified for Password, but I've put a slightly more
-- readable 'testpassword' here for clarity. Adjust as needed.
SET IDENTITY_INSERT Users ON;
INSERT INTO Users (Id, Username, RoleId, Password) VALUES
(1, 'admin_user', 1, 'testpassword'), -- Administrator
(2, 'teacher_john', 2, 'testpassword'), -- Teacher
(3, 'student_mary', 3, 'testpassword'); -- Student
SET IDENTITY_INSERT Users OFF;
GO

-- 3. Insert into Labs
-- Labs depend on Users (TeacherId)
SET IDENTITY_INSERT Labs ON;
INSERT INTO Labs (Id, Name, TeacherId) VALUES
(1, 'Chemistry Lab A', 2), -- Taught by teacher_john
(2, 'Physics Lab B', 2),   -- Also taught by teacher_john
(3, 'Biology Research', NULL);   -- No specific teacher initially
SET IDENTITY_INSERT Labs OFF;
GO

-- 4. Insert into StorageLocations
-- StorageLocations can depend on Labs
SET IDENTITY_INSERT StorageLocations ON;
INSERT INTO StorageLocations (Id, Name, Description, LabId) VALUES
(1, 'Chem Cabinet 1', 'Storage for acids and bases', 1), -- In Chemistry Lab A
(2, 'Physics Shelf 3', 'Electronics components shelf', 2), -- In Physics Lab B
(3, 'Main Storage Room', 'Centralized inventory storage', NULL), -- General storage
(4, 'Biology Fridge', 'Refrigerated storage for samples', 3); -- In Biology Research
SET IDENTITY_INSERT StorageLocations OFF;
GO

-- 5. Insert into InventoryItems
-- InventoryItems depend on Labs and StorageLocations
SET IDENTITY_INSERT InventoryItems ON;
INSERT INTO InventoryItems (Id, Name, Category, SerialNumber, Status, StorageLocationId, LabId) VALUES
(1, 'Microscope A1', 'Optics', 'MS-A1-2023-001', 1, 1, 1), -- In Chem Lab A, Chem Cabinet 1
(2, 'Beaker Set Large', 'Glassware', NULL, 1, 1, 1),
(3, 'Multimeter XYZ', 'Electronics', 'MM-XYZ-005', 1, 2, 2), -- In Physics Lab B, Physics Shelf 3
(4, 'Oscilloscope 1', 'Electronics', 'OS-001-2024', 0, 3, NULL), -- In Main Storage, not assigned to a lab
(5, 'Culture Dish Kit', 'Biology Supplies', NULL, 1, 4, 3); -- In Biology Research, Biology Fridge
SET IDENTITY_INSERT InventoryItems OFF;
GO

-- 6. Insert into Movements
-- Movements depend on InventoryItems, StorageLocations, Users
-- Type: 1 = In, 0 = Out (example)
SET IDENTITY_INSERT Movements ON;
INSERT INTO Movements (Id, Date, Type, InventoryItemId, FromStorageLocationId, ToStorageLocationId, PerformedByUserId, PerformedById) VALUES
-- Initial placement movements
(1, '2025-01-01 10:00:00', 1, 1, NULL, 1, 1, 1), -- Microscope A1 added to Chem Cabinet 1 by admin
(2, '2025-01-01 10:05:00', 1, 2, NULL, 1, 1, 1), -- Beaker Set added to Chem Cabinet 1 by admin
(3, '2025-01-05 14:30:00', 1, 3, NULL, 2, 1, 1), -- Multimeter added to Physics Shelf 3 by admin
(4, '2025-01-10 09:00:00', 1, 4, NULL, 3, 1, 1), -- Oscilloscope added to Main Storage by admin
(5, '2025-01-15 11:15:00', 1, 5, NULL, 4, 1, 1), -- Culture Dish Kit added to Biology Fridge by admin

-- Example movement (item moved from one storage to another)
(6, '2025-02-20 16:00:00', 0, 4, 3, 2, 2, 2); -- Oscilloscope moved from Main Storage to Physics Shelf 3 by teacher_john
SET IDENTITY_INSERT Movements OFF;
GO
```
