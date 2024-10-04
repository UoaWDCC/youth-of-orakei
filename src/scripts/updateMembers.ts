import axios from 'axios';
import sharp from "sharp";
import { Client } from "@notionhq/client";
import { supabase } from '../lib/supabaseClient';
import { supabaseUrl } from '../lib/supabaseClient';
import type { memberRow } from "../types/memberRow";
import { prisma } from "../lib/prisma";
import fs from 'fs';
import path from 'path';

interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string | null; // URL of the cover image
}

// Define the volume path
const VOLUME_PATH = '/data';

// Function to download image to Fly volume
async function downloadImageToVolume(url: string, fileName: string): Promise<string> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(VOLUME_PATH, fileName);
    
    // Write the ArrayBuffer response data directly to the file
    fs.writeFileSync(filePath, new Uint8Array(response.data)); // Use Uint8Array to handle the ArrayBuffer correctly

    return filePath; // Return the local file path
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(filePath: string, supabaseFilePath: string): Promise<string> {
    // Compress the image to WebP format
    const compressedImageBuffer = await sharp(filePath)
        .toFormat('webp', { quality: 35 }) 
        .toBuffer();

    // Check if the file already exists
    const { data: existingFiles, error: listError } = await supabase.storage.from('images').list(supabaseFilePath.split('/')[0]); 

    if (listError) {
        throw new Error(`Failed to list files: ${listError.message}`);
    }

    // If the file already exists, remove it before uploading
    if (existingFiles.some(file => file.name === supabaseFilePath.split('/')[1])) {
        const { error: deleteError } = await supabase.storage.from('images').remove([supabaseFilePath]);
        if (deleteError) {
            throw new Error(`Failed to delete existing image: ${deleteError.message}`);
        }
    }

    // Upload the new compressed image
    const { data, error } = await supabase.storage.from('images').upload(supabaseFilePath, compressedImageBuffer);

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL of the uploaded image
    return `${supabaseUrl}/storage/v1/object/public/images/${supabaseFilePath}`;
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
            const fileName = `${member.team}-${member.name.replace(/\s+/g, '-')}.webp`; // Define a local file name
            const filePath = await downloadImageToVolume(member.cover, fileName); // Download image to Fly volume
            const supabaseFilePath = `members/${member.team}/${fileName}`; // Generate file path for Supabase
            member.cover = await uploadImageToSupabase(filePath, supabaseFilePath); // Upload to Supabase and get new URL

            // Optionally, clean up the local file after upload
            fs.unlinkSync(filePath);
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
