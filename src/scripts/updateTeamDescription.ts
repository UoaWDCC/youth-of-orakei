import { Client } from "@notionhq/client";
import type { teamRow } from "../types/teamRow";
import prisma from "../lib/prisma";
type TeamDescriptions = {
    name: string;
    description?: string;
    tags?: string[];
};

export async function updateTeamsDescriptions(): Promise<void> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_TEAMS_ID = process.env.NOTION_TEAMS_ID || import.meta.env.NOTION_TEAMS_ID;
    if (!NOTION_TOKEN || !NOTION_TEAMS_ID) throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });


    const query = await notion.databases.query({
        database_id: NOTION_TEAMS_ID,
        sorts: [{
            property: 'Name',
            direction: 'ascending'
        }]
    });

    const teampages = query.results as teamRow[];

    const teams: TeamDescriptions[] = teampages.map((row) => {
        return {
            name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "",
            description: row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "",
            tags: row.properties.Tags.multi_select?.map(tag => tag.name) || [], // Use optional chaining and provide default
        };
    });

    // Store teams in the Prisma database
    for (const team of teams) {
        // Ensure tags is an array to avoid 'undefined' error
        const tagConnections = await Promise.all(
            (team.tags || []).map(async (tagName) => { // Use a fallback to an empty array if tags is undefined
                const tag = await prisma.teamTag.upsert({
                    where: { name: tagName },
                    create: { name: tagName },
                    update: {},
                });
                return { id: tag.id }; // Return the tag id for connecting
            })
        );

        // Upsert the team description
        await prisma.teamDescription.upsert({
            where: { name: team.name },
            create: {
                name: team.name,
                description: team.description,
                tags: {
                    connect: tagConnections, // Connect the tags
                },
            },
            update: {
                description: team.description,
                tags: {
                    set: tagConnections, // Update the tags
                },
            },
        });
    }

    console.log("Team descriptions uploaded to Prisma database.");
    await prisma.$disconnect();
}
