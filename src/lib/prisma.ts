import {PrismaClient} from "@prisma/client";
import {PrismaMssql} from "@prisma/adapter-mssql";

const adapter = new PrismaMssql({
    server: "localhost",
    port: 1433,
    database: "EvitaInventoryDB",
    user: "sa",
    password: "YourStrongPassw0rd",
    options: {
        encrypt: false, // true if Azure
        trustServerCertificate: true,
    },
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// 👇 ensure single Prisma connection in dev
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
