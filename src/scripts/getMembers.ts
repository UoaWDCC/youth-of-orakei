import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import sanitizeFilename from '../utils/sanitizeFilename';
import { Client } from "@notionhq/client";
import type { memberRow } from "../types/memberRow";

interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string; // This will store the local file path
}

// Helper function to ensure the directory exists
async function ensureDirectoryExists(directoryPath: string): Promise<void> {
    try {
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
            console.log(`Directory ${directoryPath} created.`);
        }
    } catch (err) {
        console.error(`Failed to create directory ${directoryPath}:`, err);
    }
}

// Helper function to clean up old images not part of the current member list
async function cleanupOldImages(membersFolderPath: string, validImageNames: string[]): Promise<void> {
    try {
        const files = fs.readdirSync(membersFolderPath);
        files.forEach((file: string) => {
            if (!validImageNames.includes(file)) {
                const filePath = path.join(membersFolderPath, file);
                fs.unlinkSync(filePath);
                console.log(`Deleted old image: ${file}`);
            }
        });
    } catch (err) {
        console.error(`Failed to clean up old images:`, err);
    }
}

// Main function to get members, update covers, and return the sanitized members data
export async function getMembers(): Promise<Member[]> {
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

    const membersFolderPath = path.join("/data", 'members'); // Using absolute path for Fly.io volume
    const jsonFilePath = path.join(membersFolderPath, 'membersData.json'); // Path for storing members data in JSON

    // Ensure the 'members' directory exists
    await ensureDirectoryExists(membersFolderPath);

    // Filter members that have cover images
    const membersWithCover = members.filter(member => member.cover);

    // Generate the list of valid image filenames
    const validImageNames = membersWithCover.map((member) => {
        const sanitizedFileName = sanitizeFilename(`${member.team}_${member.name}`);
        return `${sanitizedFileName}.webp`;
    });

    // Clean up old images not in the current list
    await cleanupOldImages(membersFolderPath, validImageNames);

    // Process each member's cover image
    const downloadPromises = membersWithCover.map(async (member) => {
        const sanitizedFileName = sanitizeFilename(`${member.team}_${member.name}`);
        const imageName = `${sanitizedFileName}.webp`;
        const imagePath = path.join(membersFolderPath, imageName);

        try {
            // Check if the image already exists, if not download and convert
            if (!fs.existsSync(imagePath)) {
                const response = await axios({
                    url: member.cover,
                    method: 'GET',
                    responseType: 'arraybuffer',
                });

                // Convert to WebP format and save locally
                const compressedImageBuffer = await sharp(response.data)
                    .webp({ quality: 60 })
                    .resize({ width: 500 })
                    .toBuffer();

                fs.writeFileSync(imagePath, new Uint8Array(compressedImageBuffer));
                console.log(`Image ${imageName} downloaded and saved.`);
            }

          
            member.cover = `${sanitizedFileName}.webp`; // Only the file name, no path


        } catch (err) {
            console.error(`Failed to download or process image for ${member.name}:`, err);
        }
    });

    // Wait for all images to be downloaded and processed
    await Promise.all(downloadPromises);

    console.log('All images downloaded and processed.');

    // Write members to a JSON file
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(members, null, 2));
        console.log(`Members data saved to ${jsonFilePath}`);
    } catch (err) {
        console.error(`Failed to save members data to JSON file:`, err);
    }

    // Return the updated members array
    return members;
}
