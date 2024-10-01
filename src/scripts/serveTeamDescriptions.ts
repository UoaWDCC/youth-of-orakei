import { PrismaClient } from '@prisma/client';
import type { TeamDescription, TeamTag } from '@prisma/client'; // Use type-only import

// Initialize Prisma Client
const prisma = new PrismaClient();

type TeamDescriptions = {
  name: string;
  description?: string;
  tags?: string[]; // Array of tag names
};

export async function serveTeamDescriptions(): Promise<TeamDescriptions[]> {
  let teamDescriptions: TeamDescriptions[] = []; // Explicitly type the result variable

  try {
    // Fetch team descriptions with their related tags
    const descriptions: (TeamDescription & { tags: TeamTag[] })[] = await prisma.teamDescription.findMany({
      include: {
        tags: true, // Fetch related tags
      },
    });

    // Map the results to the TeamDescriptions type
    teamDescriptions = descriptions.map((team: TeamDescription & { tags: TeamTag[] }) => ({
      name: team.name,
      description: team.description ?? undefined, // Handle null values for description
      tags: team.tags.map((tag: TeamTag) => tag.name) || [], // Convert tag objects to an array of tag names
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
