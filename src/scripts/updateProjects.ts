import { Client } from "@notionhq/client";
import type { projectRow } from '../types/projectRow.ts';
import axios from 'axios';
import sharp from "sharp";
import { supabase } from '../lib/supabaseClient'; 
import { supabaseUrl } from '../lib/supabaseClient';
import { prisma } from "../lib/prisma.ts";
import type { APIRoute } from 'astro';

// Function to sanitize filenames
function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9-_.]/gi, '-'); // Replace invalid characters with hyphen
}

// Function to download image from URL
async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Function to delete image from Supabase Storage
async function deleteImageFromSupabase(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from('images').remove([filePath]);

    if (error) {
        console.error(`Failed to delete image: ${error.message}`);
    }
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(imageBuffer: Buffer, filePath: string): Promise<string> {
    // Convert image to WebP format and compress it
    const compressedImageBuffer = await sharp(imageBuffer)
        .toFormat('webp', { quality: 30 })
        .toBuffer();

    // Attempt to delete the existing image first
    await deleteImageFromSupabase(filePath);

    // Upload the new image to Supabase
    const { data, error } = await supabase.storage.from('images').upload(filePath, compressedImageBuffer);

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL of the uploaded image
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
}

// Function to log messages
function sendLog(controller: ReadableStreamDefaultController, message: string) {
    try {
        const logMessage = {
            message,
            timestamp: Date.now(),
        };
        controller.enqueue(`data: ${JSON.stringify(logMessage)}\n\n`);
    } catch (error) {
        console.error("Error sending log:", error);
    }
}

// Update the updateProjects function
export async function updateProjects(controller: ReadableStreamDefaultController): Promise<void> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_PROJECTS_ID = process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

    if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
        throw new Error("Missing secret(s)");
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        sendLog(controller, "Starting to retrieve projects from Notion...");

        // Step 1: Get all project IDs from Notion
        const query = await notion.databases.query({
            database_id: NOTION_PROJECTS_ID,
            sorts: [{ property: 'Date', direction: 'descending' }]
        });
        const projectsRows = query.results as projectRow[];

        // Get Notion project IDs
        const notionProjectIds = projectsRows.map(row => row.id);

        // Step 2: Get all projects from the Prisma database
        const prismaProjects = await prisma.project.findMany({
            select: { id: true, cover: true }, // Select only the fields needed for deletion
        });
        const prismaProjectIds = prismaProjects.map(project => project.id);

        // Step 3: Identify projects to delete (those in Prisma but not in Notion)
        const projectsToDelete = prismaProjects.filter(project => !notionProjectIds.includes(project.id));

        // Step 4: Delete projects from Prisma and Supabase
        for (const project of projectsToDelete) {
            // Delete the project image from Supabase if it exists
            if (project.cover) {
                await deleteImageFromSupabase(project.cover); // Assuming the cover stores the file path
            }

            // Delete the project from Prisma
            await prisma.project.delete({
                where: { id: project.id },
            });

            sendLog(controller, `Deleted project ${project.id} from Prisma and its image from Supabase.`);
        }

        // Process the remaining projects (already in your existing logic)
        const projectPromises = projectsRows.map(async (row) => {
            const title = row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "";
            const dateStr = row.properties.Date.date ? row.properties.Date.date.start : "";
            const date = dateStr ? new Date(dateStr) : null; // Convert string to Date object
            const description = row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "";
            const coverUrl = row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? "";
            const team = row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "";
            const tags = row.properties.Tags?.multi_select.map((tag) => tag.name) || []; // Ensure tags is always an array
            const id = row.id || ""; // Ensure the Notion ID is being used

            // Sanitize the title for cover path
            const sanitizedTitle = sanitizeFileName(title);
            let coverPath = '';

            // If a cover URL exists, download and upload the image to Supabase
            if (coverUrl) {
                try {
                    sendLog(controller, `Downloading image for project: ${title}`);
                    const imageBuffer = await downloadImage(coverUrl); // Download image
                    coverPath = await uploadImageToSupabase(imageBuffer, `projects/${sanitizedTitle}/cover.webp`); // Upload to Supabase
                    sendLog(controller, `Uploaded cover image for project: ${title}`);
                } catch (error) {
                    sendLog(controller, `Error processing cover image for project ${title}: ${(error as Error).message}`);
                }
            }

            return {
                id, // Use Notion ID as unique identifier
                title,
                date,
                description,
                cover: coverPath, // Store the Supabase URL
                team,
                tags,
            };
        });

        // Await all async operations
        const projects = await Promise.all(projectPromises);

        // Store projects in the Prisma database
        for (const project of projects) {
            // Check if the project already exists in the database by ID
            const existingProject = await prisma.project.findUnique({
                where: { id: project.id },
            });

            // If project exists, update it, else create a new one
            await prisma.project.upsert({
                where: { id: project.id },
                create: {
                    id: project.id, // Ensure the ID is passed during creation
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

            sendLog(controller, `Project ${project.title} upserted in the database.`);
        }

        sendLog(controller, "Projects data uploaded to Prisma database.");
    } catch (error) {
        console.error("Error retrieving or processing projects:", error);
        sendLog(controller, `Error retrieving or processing projects: ${(error as Error).message}`);
    }
}