import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getPage } from "./getPageDescriptions.ts";
import axios from 'axios';
import sharp from "sharp";
import { supabase } from '../lib/supabaseClient';
import { supabaseUrl } from '../lib/supabaseClient';
import { prisma } from "../lib/prisma";

// Type for descriptions
type Description = {
    heading: string;
    subheadings: string[];
    paragraphs: string[];
    images: string[];
};

// Function to download image from URL
async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Function to upload image to Supabase Storage
async function uploadImageToSupabase(imageBuffer: Buffer, filePath: string): Promise<string> {
    // Convert image to WebP format and compress it
    const compressedImageBuffer = await sharp(imageBuffer)
        .toFormat('webp', { quality: 35 })
        .toBuffer();

    // Check if the file already exists
    const { data: existingFiles, error: listError } = await supabase.storage.from('images').list(filePath.split('/')[0]);

    if (listError) {
        throw new Error(`Failed to list files: ${listError.message}`);
    }

    const existingFileName = filePath.split('/').pop();
    const existingFile = existingFiles.find(file => file.name === existingFileName);

    // If the file already exists, remove it before uploading
    if (existingFile) {
        console.log(`Deleting existing image: ${existingFileName}`); // Log the deletion
        const { error: deleteError } = await supabase.storage.from('images').remove([filePath]);
        if (deleteError) {
            throw new Error(`Failed to delete existing image: ${deleteError.message}`);
        }
    }

    // Now upload the new image
    const { error } = await supabase.storage.from('images').upload(filePath, compressedImageBuffer);

    // If there's an error uploading, check if it's because it already exists
    if (error) {
        if (error.message.includes("already exists")) {
            console.warn(`Image ${filePath} already exists. Skipping upload.`); // Warn if it already exists
            return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
        }
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return the public URL of the uploaded image
    return `${supabaseUrl}/storage/v1/object/public/images/${filePath}`;
}

// Function to sanitize filenames
function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-z0-9-_.]/gi, '-'); // Replace invalid characters with hyphen
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

// Update the image upload process in updateHomepageDescriptions
export async function updateHomepageDescriptions(controller: ReadableStreamDefaultController): Promise<void> {
    const descriptions: Record<string, Description> = {};

    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_HOMEPAGE_ID = process.env.NOTION_HOMEPAGE_ID || import.meta.env.NOTION_HOMEPAGE_ID;

    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID) throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        sendLog(controller, "Starting to retrieve homepage descriptions...");

        const query = await notion.databases.query({
            database_id: NOTION_HOMEPAGE_ID,
            sorts: [{ property: 'Name', direction: 'ascending' }]
        });

        for (const page of query.results) {
            if ('properties' in page) {
                const nameProperty = page.properties.Name;
                if (nameProperty.type === 'title' && Array.isArray(nameProperty.title) && nameProperty.title.length > 0) {
                    const title: string = nameProperty.title[0].plain_text;
                    const pageId: string = page.id;
                    console.log(`Processing homepage description: ${title}`); // Log the project being processed
                    sendLog(controller, `Processing homepage description: ${title}`);

                    const blocks = await fetchPageBlocks(notion, pageId);
                    const { subheadings, paragraphs, images } = await getPage(blocks);

                    // Process images: download and upload to Supabase
                    const uploadedImages: string[] = [];
                    for (const imageUrl of images) {
                        try {
                            const imageBuffer = await downloadImage(imageUrl); // Download image
                            const sanitizedTitle = sanitizeFileName(title); // Sanitize title for filename
                            const filePath = `homepage/${sanitizedTitle}/${imageUrl.split('/').pop()}`; // Generate file path
                            const uploadedImageUrl = await uploadImageToSupabase(imageBuffer, filePath); // Upload to Supabase
                            uploadedImages.push(uploadedImageUrl); // Store the new URL
                            sendLog(controller, `Uploaded image for ${title}: ${uploadedImageUrl}`);
                        } catch (error) {
                            sendLog(controller, `Error processing image for ${title}: ${(error as Error).message}`);
                        }
                    }

                    // Upsert the homepage description into the database
                    await prisma.homepageDescription.upsert({
                        where: { heading: title },
                        update: {
                            subheadings,
                            paragraphs,
                            images: uploadedImages, // Store the uploaded image URLs
                        },
                        create: {
                            heading: title,
                            subheadings,
                            paragraphs,
                            images: uploadedImages, // Store the uploaded image URLs
                        },
                    });

                    descriptions[title] = {
                        heading: title,
                        subheadings,
                        paragraphs,
                        images: uploadedImages, // Store the uploaded image URLs
                    };
                    sendLog(controller, `Upserted description for ${title}`);
                }
            }
        }

        sendLog(controller, "Homepage descriptions updated successfully.");
    } catch (error) {
        console.error("Error retrieving or processing homepage descriptions:", error);
        sendLog(controller, `Error retrieving or processing homepage descriptions: ${(error as Error).message}`);
    }
}
