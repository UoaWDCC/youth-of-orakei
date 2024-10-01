import axios from 'axios';
import { Client } from "@notionhq/client";
import { PrismaClient } from '@prisma/client';
import type { memberRow } from "../types/memberRow";

const prisma = new PrismaClient();

interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string | null; // URL of the cover image
}

// Main function to get members, update covers, and return the updated members data
export async function updateMembers(): Promise<Member[]> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_MEMBERS_ID = process.env.NOTION_MEMBERS_ID || import.meta.env.NOTION_MEMBERS_ID;

    if (!NOTION_TOKEN || !NOTION_MEMBERS_ID) {
        throw new Error("Missing secret(s)");
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: NOTION_MEMBERS_ID,
        sorts: [{
            property: 'Name',
            direction: 'ascending'
        }]
    });

    const membersPages = query.results as memberRow[];
    const members: Member[] = membersPages.map((row) => ({
        team: row.properties.Team.rich_text[0]?.plain_text ?? "",
        desc: row.properties.Description.rich_text[0]?.plain_text ?? "",
        name: row.properties.Name.title[0]?.plain_text ?? "",
        cover: row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? null
    }));

    // Process each member
    for (const member of members) {
        // Check if the member already exists based on both name and team
        const existingMember = await prisma.member.findFirst({
            where: {
                name: member.name,
                team: member.team
            }
        });

        if (existingMember) {
            // Update existing member
            await prisma.member.update({
                where: { id: existingMember.id },
                data: {
                    description: member.desc,
                    cover: member.cover // Store the cover URL
                }
            });
            console.log(`Member ${member.name} updated in the database.`);
        } else {
            // Create a new member
            await prisma.member.create({
                data: {
                    team: member.team,
                    name: member.name,
                    description: member.desc,
                    cover: member.cover // Store the cover URL
                }
            });
            console.log(`Member ${member.name} saved to the database.`);
        }
    }

    // Clean up members that are in the database but not in the Notion query results
    const existingMembers = await prisma.member.findMany();
    const memberNamesAndTeams = members.map(member => ({ name: member.name, team: member.team }));

    for (const existingMember of existingMembers) {
        const existsInNotion = memberNamesAndTeams.some(
            member => member.name === existingMember.name && member.team === existingMember.team
        );

        if (!existsInNotion) {
            await prisma.member.delete({
                where: { id: existingMember.id }
            });
            console.log(`Deleted member ${existingMember.name} from the database.`);
        }
    }

    console.log('All members processed.');

    return members; // Optionally, return the updated members array
}
