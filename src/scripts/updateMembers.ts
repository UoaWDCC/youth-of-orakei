import { Client } from "@notionhq/client";
import { supabase } from '../lib/supabaseClient';
import { supabaseUrl } from '../lib/supabaseClient';
import type { memberRow } from "../types/memberRow";
import { prisma } from "../lib/prisma";

interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string | null; // URL of the cover image
}

// Function to download image using Fetch API (compatible with edge environments)
async function downloadImage(url: string): Promise<Buffer> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Function to upload image to Supabase Storage (without sharp)
async function uploadImageToSupabase(imageBuffer: Buffer, filePath: string): Promise<string> {
    // Check if the file already exists
    const { data: existingFiles, error: listError } = await supabase.storage.from('images').list(filePath.split('/')[0]); // List files in the folder

    if (listError) {
        throw new Error(`Failed to list files: ${listError.message}`);
    }

    // If the file already exists, remove it before uploading
    if (existingFiles.some(file => file.name === filePath.split('/')[1])) {
        const { error: deleteError } = await supabase.storage.from('images').remove([filePath]);
        if (deleteError) {
            throw new Error(`Failed to delete existing image: ${deleteError.message}`);
        }
    }

    // Now upload the new image (in its original format)
    const { data, error } = await supabase.storage.from('images').upload(filePath, imageBuffer);

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL of the uploaded image
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
}

// Function to delete an image from Supabase Storage
async function deleteImageFromSupabase(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from('images').remove([filePath]);

    if (error) {
        console.error(`Failed to delete image: ${error.message}`);
    }
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
        if (member.cover) {
            const imageBuffer = await downloadImage(member.cover); // Download image using Fetch API
            const filePath = `members/${member.team}/${member.name.replace(/\s+/g, '-')}.webp`; // Generate file path with .webp extension
            member.cover = await uploadImageToSupabase(imageBuffer, filePath); // Upload to Supabase and get new URL
        }

        // Check if the member already exists based on both name and team
        const existingMember = await prisma.member.findFirst({
            where: {
                name: member.name,
                team: member.team
            }
        });

        if (existingMember) {
            // Store the current cover URL before updating
            const currentCover = existingMember.cover;

            // Update existing member
            await prisma.member.update({
                where: { id: existingMember.id },
                data: {
                    description: member.desc,
                    cover: member.cover // Store the Supabase URL
                }
            });
            console.log(`Member ${member.name} updated in the database.`);

            // Check if the cover URL has changed
            if (currentCover && currentCover !== member.cover) {
                const oldFilePath = `members/${existingMember.team}/${existingMember.name.replace(/\s+/g, '-')}.webp`; // Generate the old file path
                await deleteImageFromSupabase(oldFilePath); // Delete old image
            }
        } else {
            // Create a new member
            await prisma.member.create({
                data: {
                    team: member.team,
                    name: member.name,
                    description: member.desc,
                    cover: member.cover // Store the Supabase URL
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
            if (existingMember.cover) {
                const filePath = `members/${existingMember.team}/${existingMember.name.replace(/\s+/g, '-')}.webp`; // Generate the file path
                await deleteImageFromSupabase(filePath); // Delete image
            }

            await prisma.member.delete({
                where: { id: existingMember.id }
            });
            console.log(`Deleted member ${existingMember.name} from the database.`);
        }
    }

    console.log('All members processed.');

    return members;
}
