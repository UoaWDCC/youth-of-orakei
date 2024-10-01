// src/lib/fetchHomepageDescriptions.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches homepage descriptions from the Prisma database.
 * @returns {Promise<any[]>} An array of homepage descriptions.
 */
export async function fetchHomepageDescriptions(): Promise<any[]> {
    try {
        const descriptions = await prisma.homepageDescription.findMany();
        return descriptions;
    } catch (error) {
        console.error("Error fetching homepage descriptions:", error);
        return []; // Return an empty array on error
    } finally {
        await prisma.$disconnect(); // Ensure to disconnect the Prisma client
    }
}
