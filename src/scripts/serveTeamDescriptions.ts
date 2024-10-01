import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

type TeamDescriptions = {
  name: string;
  description?: string;
  tags?: string[]; // Array of tag names
};

/**
 * Fetches team descriptions with their tags from the database.
 * @returns {Promise<TeamDescriptions[]>} An array of team descriptions with tags.
 */
export async function serveTeamDescriptions(): Promise<TeamDescriptions[]> {
  let teamDescriptions: TeamDescriptions[] = []; // Explicitly type the result variable

  try {
    // Fetch team descriptions with their related tags
    const descriptions = await prisma.teamDescription.findMany({
      include: {
        tags: true, // Fetch related tags
      },
    });

    // Map the results to the TeamDescriptions type
    teamDescriptions = descriptions.map((team) => ({
      name: team.name,
      description: team.description ?? undefined, // Handle null values for description
      tags: team.tags.map((tag) => tag.name) || [], // Convert tag objects to an array of tag names
    }));

  } catch (err) {
    console.error("Error fetching team descriptions:", err);
    teamDescriptions = []; // Fallback to an empty array in case of error
  } finally {
    // Close Prisma Client connection
    await prisma.$disconnect();
  }

  return teamDescriptions;
}
