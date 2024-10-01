import { Client } from "@notionhq/client";

import type { projectRow } from '../types/projectRow.ts';
import axios from 'axios';
import sharp from "sharp";
import { supabase } from '../lib/supabaseClient'; // Adjust import based on your project structure
import { supabaseUrl } from '../lib/supabaseClient';
import {prisma} from "../lib/prisma.ts";
// Function to sanitize file names
function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9-_.]/gi, '-'); // Replace invalid characters with hyphen
}

// Function to download image from URL
async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(imageBuffer: Buffer, filePath: string): Promise<string> {
    // Convert image to WebP format and compress it
    const compressedImageBuffer = await sharp(imageBuffer)
        .toFormat('webp', { quality: 30 }) 
        .toBuffer();

    const { data, error } = await supabase.storage.from('images').upload(filePath, compressedImageBuffer);

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL of the uploaded image
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
}

export async function updateProjects(): Promise<void> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_PROJECTS_ID = process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

    if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
        throw new Error("Missing secret(s)");
    }

    const notion = new Client({ auth: NOTION_TOKEN });
    

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

            // Sanitize the title for cover path
            const sanitizedTitle = sanitizeFileName(title);
            let coverPath = '';

            // If a cover URL exists, download and upload the image to Supabase
            if (coverUrl) {
                const imageBuffer = await downloadImage(coverUrl); // Download image
                coverPath = await uploadImageToSupabase(imageBuffer, `projects/${sanitizedTitle}/cover.webp`); // Upload to Supabase
            }

            return {
                title,
                date,
                description,
                cover: coverPath, // Store the Supabase URL
                team,
                tags,
                id,
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
    }
}
