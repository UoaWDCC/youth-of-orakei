// scripts/fetchMembers.ts
import { PrismaClient } from '@prisma/client';
import type { memberData } from '../types/memberData';

const prisma = new PrismaClient();

/**
 * Fetches members from the database.
 * @returns {Promise<memberData[]>} An array of members.
 */
export async function fetchMembers(): Promise<memberData[]> {
    let members: memberData[] = []; // Explicitly type the members variable
    try {
        members = await prisma.member.findMany(); // Fetch all members from the database
    } catch (err) {
        console.error("Error fetching members data:", err);
        members = [];  // Fallback to an empty array
    }
    return members;
}
