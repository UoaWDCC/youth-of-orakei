import { Client } from "@notionhq/client";
import type { projectRow } from '../types/projectRow.ts';
import axios from 'axios';
import sharp from "sharp";
import { supabase } from '../lib/supabaseClient'; 
import { supabaseUrl } from '../lib/supabaseClient';
import { prisma } from "../lib/prisma.ts";

// Function to sanitize filenames
function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9-_.]/gi, '-'); // Replace invalid characters with hyphen
}

// Function to download image from URL with timeout and error handling
async function downloadImage(url: string): Promise<Buffer> {
    try {
        console.log(`Starting download of image from URL: ${url}`);
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 10000, // Set a timeout of 10 seconds
        });
        console.log(`Successfully downloaded image from URL: ${url}`);
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error(`Error downloading image from URL: ${url}`, error);
        throw new Error(`Failed to download image: ${(error as Error).message}`);
    }
}

// Function to download image with retry logic
async function downloadImageWithRetry(url: string, retries = 3): Promise<Buffer> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await downloadImage(url);
        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${(error as Error).message}`);
            if (attempt === retries) {
                throw error;
            }
            // Wait 1 second before retrying
            await new Promise(res => setTimeout(res, 1000));
        }
    }
    throw new Error('Failed to download image after retries');
}

// Function to fetch fresh cover URL from Notion
async function getFreshCoverUrl(notion: Client, pageId: string): Promise<string> {
    try {
        const page = await notion.pages.retrieve({ page_id: pageId }) as projectRow;
        const coverUrl = page.cover?.type === "external"
            ? page.cover?.external.url
            : page.cover?.file.url ?? "";
        return coverUrl;
    } catch (error) {
        throw new Error(`Failed to retrieve fresh cover URL: ${(error as Error).message}`);
    }
}

// Function to delete image from Supabase Storage
async function deleteImageFromSupabase(filePath: string): Promise<void> {
    const { error } = await supabase.storage.from('images').remove([filePath]);

    if (error) {
        console.error(`Failed to delete image: ${error.message}`);
    }
}

// Function to upload image to Supabase Storage with error handling
async function uploadImageToSupabase(imageBuffer: Buffer, filePath: string): Promise<string> {
    try {
        // Convert image to WebP format and compress it
        const compressedImageBuffer = await sharp(imageBuffer)
            .toFormat('webp', { quality: 30 })
            .toBuffer();

        // Attempt to delete the existing image first
        await deleteImageFromSupabase(filePath);

        // Upload the new image to Supabase
        const { data, error } = await supabase.storage
            .from('images')
            .upload(filePath, compressedImageBuffer, { upsert: true });

        if (error) {
            throw new Error(`Failed to upload image: ${error.message}`);
        }

        // Return the public URL of the uploaded image
        return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
    } catch (error) {
        throw new Error(`Failed to process and upload image: ${(error as Error).message}`);
    }
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

// Function to process a single project with timeout
async function processProject(
    notion: Client,
    row: projectRow,
    controller: ReadableStreamDefaultController
): Promise<{
    id: string;
    title: string;
    date: Date | null;
    description: string;
    cover: string | null;
    team: string;
    tags: string[];
}> {
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Processing timed out')), 60000) // 60 seconds timeout per project
    );

    return Promise.race([
        (async () => {
            const title = row.properties.Name.title[0]?.plain_text ?? "";
            const dateStr = row.properties.Date.date?.start ?? "";
            const date = dateStr ? new Date(dateStr) : null;
            const description = row.properties.Description.rich_text[0]?.plain_text ?? "";
            const team = row.properties.Team.rich_text[0]?.plain_text ?? "";
            const tags = row.properties.Tags?.multi_select.map((tag) => tag.name) || [];
            const id = row.id || "";

            // Sanitize the title for cover path
            const sanitizedTitle = sanitizeFileName(title);

            // Fetch fresh cover URL
            let coverUrl = '';
            if (row.cover) {
                try {
                    coverUrl = await getFreshCoverUrl(notion, row.id);
                } catch (error) {
                    sendLog(
                        controller,
                        `Error fetching fresh cover URL for project ${title}: ${(error as Error).message}`
                    );
                }
            }

            // Proceed with image processing if coverUrl is available
            let coverPath: string | null = null;
            if (coverUrl) {
                try {
                    sendLog(controller, `Downloading image for project: ${title}`);
                    const imageBuffer = await downloadImageWithRetry(coverUrl);
                    const filePath = `projects/${id}/cover.webp`; // Use project ID for uniqueness
                    coverPath = await uploadImageToSupabase(imageBuffer, filePath);
                    sendLog(controller, `Uploaded cover image for project: ${title}`);
                } catch (error) {
                    sendLog(
                        controller,
                        `Error processing cover image for project ${title}: ${(error as Error).message}`
                    );
                    coverPath = null;
                }
            }

            return {
                id,
                title,
                date,
                description,
                cover: coverPath, // coverPath is string | null
                team,
                tags,
            };
        })(),
        timeoutPromise,
    ]);
}

// Update the updateProjects function
export async function updateProjects(
    controller: ReadableStreamDefaultController
): Promise<void> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_PROJECTS_ID =
        process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

    if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
        sendLog(controller, "Missing Notion token or database ID.");
        throw new Error("Missing secret(s)");
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        sendLog(controller, "Starting to retrieve projects from Notion...");

        // Step 1: Get all project IDs from Notion
        const query = await notion.databases.query({
            database_id: NOTION_PROJECTS_ID,
            sorts: [{ property: 'Date', direction: 'descending' }],
        });
        const projectsRows = query.results as projectRow[];

        // Get Notion project IDs
        const notionProjectIds = projectsRows.map(row => row.id);

        // Step 2: Get all projects from the Prisma database
        const prismaProjects = await prisma.project.findMany({
            select: { id: true, cover: true }, // Select only the fields needed for deletion
        });

        // Step 3: Identify projects to delete (those in Prisma but not in Notion)
        const projectsToDelete = prismaProjects.filter(
            project => !notionProjectIds.includes(project.id)
        );

        // Step 4: Delete projects from Prisma and Supabase
        for (const project of projectsToDelete) {
            // Delete the project image from Supabase if it exists
            if (project.cover) {
                const filePath = `projects/${project.id}/cover.webp`; // Adjusted to use project ID
                await deleteImageFromSupabase(filePath);
            }

            // Delete the project from Prisma
            await prisma.project.delete({
                where: { id: project.id },
            });

            sendLog(
                controller,
                `Deleted project ${project.id} from Prisma and its image from Supabase.`
            );
        }

        // Process the remaining projects
        const projects: Array<{
            id: string;
            title: string;
            date: Date | null;
            description: string;
            cover: string | null;
            team: string;
            tags: string[];
        }> = [];

        for (const row of projectsRows) {
            try {
                const project = await processProject(notion, row, controller);
                projects.push(project);
            } catch (error) {
                sendLog(
                    controller,
                    `Error processing project ${row.id}: ${(error as Error).message}`
                );
            }
        }

        // Store projects in the Prisma database
        for (const project of projects) {
            try {
                // Upsert the project in the database
                await prisma.project.upsert({
                    where: { id: project.id },
                    create: {
                        id: project.id,
                        title: project.title,
                        date: project.date,
                        description: project.description,
                        cover: project.cover ?? "", // cover is string | null
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
                        cover: project.cover ?? "", // cover is string | null
                        team: project.team,
                        tags: {
                            set: [], // Reset tags
                            connectOrCreate: project.tags.map(tag => ({
                                where: { name: tag },
                                create: { name: tag },
                            })),
                        },
                    },
                });

                sendLog(controller, `Project ${project.title} upserted in the database.`);
            } catch (error) {
                sendLog(
                    controller,
                    `Error upserting project ${project.title}: ${(error as Error).message}`
                );
            }
        }

        sendLog(controller, "Projects data uploaded to Prisma database.");
    } catch (error) {
        console.error("Error retrieving or processing projects:", error);
        sendLog(
            controller,
            `Error retrieving or processing projects: ${(error as Error).message}`
        );
    }
}
