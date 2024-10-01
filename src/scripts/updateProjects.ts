import { Client } from "@notionhq/client";
import { PrismaClient } from '@prisma/client'; // Import PrismaClient
import type { projectRow } from '../types/projectRow.ts';

export async function updateProjects(): Promise<void> {
  const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  const NOTION_PROJECTS_ID = process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

  if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
    throw new Error("Missing secret(s)");
  }

  const notion = new Client({ auth: NOTION_TOKEN });
  const prisma = new PrismaClient(); // Initialize Prisma Client

  try {
    const query = await notion.databases.query({
      database_id: NOTION_PROJECTS_ID,
      sorts: [{ property: 'Date', direction: 'descending' }]
    });

    const projectsRows = query.results as projectRow[];

    const projectPromises = projectsRows.map(async (row) => {
      const title = row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "";
      const dateStr = row.properties.Date.date ? row.properties.Date.date.start : "";
      const date = dateStr ? new Date(dateStr) : null; // Convert string to Date object
      const description = row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "";
      const coverUrl = row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? "";
      const team = row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "";
      const tags = row.properties.Tags?.multi_select.map((tag) => tag.name) || []; // Ensure tags is always an array
      const id = row.id || "";

      // Prepare cover path to be stored directly in the database
      const coverPath = coverUrl ? coverUrl : "";

      return {
        title,
        date,
        description,
        cover: coverPath, 
        team,
        tags,
        id
      };
    });

    // Await all async operations
    const projects = await Promise.all(projectPromises);

    // Store projects in the Prisma database
    for (const project of projects) {
      await prisma.project.upsert({
        where: { id: project.id },
        create: {
          title: project.title,
          date: project.date, 
          description: project.description,
          cover: project.cover,
          team: project.team,
          tags: {
            connectOrCreate: project.tags.map(tag => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
        update: {
          title: project.title,
          date: project.date,
          description: project.description,
          cover: project.cover,
          team: project.team,
          tags: {
            set: project.tags.map(tag => ({
              name: tag,
            })),
          },
        },
      });
    }

    console.log("Projects data uploaded to Prisma database.");
  } catch (error) {
    console.error("Error retrieving or processing projects:", error);
  } finally {
    await prisma.$disconnect();
  }
}
