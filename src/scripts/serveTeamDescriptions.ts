import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the structure of the team with tags included
type TeamWithTags = {
  name: string;
  description: string | null;
  tags: { name: string }[]; // Array of tag objects with 'name' field
};

type TeamDescriptions = {
  name: string;
  description?: string;
  tags?: string[]; // Array of tag names
};

export async function serveTeamDescriptions(): Promise<TeamDescriptions[]> {
  let teamDescriptions: TeamDescriptions[] = [];

  try {
  
    const descriptions = await prisma.teamDescription.findMany({
      include: {
        tags: true, 
      },
    }) as TeamWithTags[]; 

  
    teamDescriptions = descriptions.map((team) => ({
      name: team.name,
      description: team.description ?? undefined, 
      tags: team.tags?.map((tag) => tag.name) || [], 
    }));

  } catch (err) {
    console.error("Error fetching team descriptions:", err);
    teamDescriptions = []; 
  } finally {
    await prisma.$disconnect(); 
  }

  return teamDescriptions;
}
