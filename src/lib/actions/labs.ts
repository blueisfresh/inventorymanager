'use server';

import { prisma } from '@/lib/prisma';

export async function getLabs() {
    return await prisma.labs.findMany({
        include: {
            Users: true,
        },
    });
}

export async function getTeachers() {
    return await prisma.users.findMany({
        include: {
            Roles: true,
        },
        // Assuming role ID 2 is for teachers, adjust based on your data
        where: {
            RoleId: 2,
        },
    });
}