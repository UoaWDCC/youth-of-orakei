import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getPage } from "./getPageDescriptions.ts";
import sanitizeFilename from '../utils/sanitizeFilename.ts';

type Description = {
    heading: string;
    subheadings: string[];
    paragraphs: string[];
    images: string[];
};

async function ensureDirectoryExists(directoryPath: string): Promise<void> {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
        console.log(`Directory ${directoryPath} created.`);
    }
}

async function downloadAndProcessImage(imageUrl: string, folderPath: string, fileName: string): Promise<string> {
    const imagePath = path.join(folderPath, `${fileName}.webp`);
    
    // Check if the image already exists
    if (!fs.existsSync(imagePath)) {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const compressedImageBuffer = await sharp(response.data)
            .webp({ quality: 80 })
            .toBuffer();
        fs.writeFileSync(imagePath, new Uint8Array(compressedImageBuffer));
        console.log(`Image ${fileName}.webp downloaded, compressed, and saved.`);
    } else {
        console.log(`Image ${fileName}.webp already exists.`);
    }

    return `/homepage/${fileName}.webp`; // Return the public path for the image
}

export async function getHomepageDescriptions(): Promise<void> {
    const descriptions: Record<string, Description> = {};

    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_HOMEPAGE_ID = process.env.NOTION_HOMEPAGE_ID || import.meta.env.NOTION_HOMEPAGE_ID;

    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID) throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });
    const publicFolderPath = path.join(process.cwd(), 'public');
    const homepageFolderPath = path.join(publicFolderPath, 'homepage');

    // Ensure the 'homepage' directory exists
    await ensureDirectoryExists(homepageFolderPath);

    try {
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
                    const blocks = await fetchPageBlocks(notion, pageId);
                    const { subheadings, paragraphs, images } = await getPage(blocks);

                    // Process and store images
                    const sanitizedTitle = sanitizeFilename(title);
                    const processedImages = await Promise.all(
                        images.map((url, idx) =>
                            downloadAndProcessImage(url, homepageFolderPath, `${sanitizedTitle}_image_${idx}`)
                        )
                    );

                    descriptions[title] = {
                        heading: title,
                        subheadings,
                        paragraphs,
                        images: processedImages // Store local paths of images
                    };
                }
            }
        }

        // Save the descriptions to a JSON file
        const jsonFilePath = path.join(homepageFolderPath, 'homepageData.json');
        fs.writeFileSync(jsonFilePath, JSON.stringify(descriptions, null, 2));
        console.log(`Homepage descriptions saved to ${jsonFilePath}`);

    } catch (error) {
        console.error("Error retrieving or processing homepage descriptions:", error);
    }
}
