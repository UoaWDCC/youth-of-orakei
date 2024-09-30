import axios from 'axios';
import sharp from 'sharp';
import { PrismaClient } from '@prisma/client';
import type { memberRow } from "../types/memberRow";
import { Client } from "@notionhq/client";

const prisma = new PrismaClient();

interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string; // This will store the compressed image binary data as a buffer
}

// Helper function to download and compress image to a buffer
async function downloadAndCompressImage(imageUrl: string): Promise<Buffer> {
    try {
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        // Compress the image to WebP format in memory (not writing to disk)
        const compressedImageBuffer = await sharp(response.data)
            .webp({ quality: 60 })
            .resize({ width: 500 })
            .toBuffer();

        return compressedImageBuffer;
    } catch (err) {
        console.error(`Failed to download or process image:`, err);
        throw err;
    }
}

// Main function to get members, compress images, and save to the database
export async function getMembers(): Promise<void> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_MEMBERS_ID = process.env.NOTION_MEMBERS_ID || import.meta.env.NOTION_MEMBERS_ID;

    if (!NOTION_TOKEN || !NOTION_MEMBERS_ID)
        throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: NOTION_MEMBERS_ID,
        sorts: [{
            property: 'Name',
            direction: 'ascending'
        }]
    });

    const memberspages = query.results as memberRow[];
    const members: Member[] = memberspages.map((row) => {
        return {
            team: row.properties.Team.rich_text[0]?.plain_text ?? "",
            desc: row.properties.Description.rich_text[0]?.plain_text ?? "",
            name: row.properties.Name.title[0]?.plain_text ?? "",
            cover: row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? ""
        };
    });

    // Filter members that have cover images
    const membersWithCover = members.filter(member => member.cover);

    // Loop through each member, download, compress the image, then store in the database
    for (const member of membersWithCover) {
        try {
            // Download and compress the image into a buffer
            const compressedImageBuffer = await downloadAndCompressImage(member.cover);

            // Save the member to the database using Prisma, storing the image data as binary (buffer)
            await prisma.member.upsert({
                where: { name: member.name },
                update: {
                    team: member.team,
                    description: member.desc,
                    cover: compressedImageBuffer, // Store binary image data
                },
                create: {
                    team: member.team,
                    name: member.name,
                    description: member.desc,
                    cover: compressedImageBuffer, // Store binary image data
                }
            });

            console.log(`Member ${member.name} saved to the database with compressed image.`);
        } catch (err) {
            console.error(`Failed to process member ${member.name}:`, err);
        }
    }

    console.log('All members data and images saved to the database.');
}
