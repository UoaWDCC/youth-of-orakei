import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp'; // Import sharp for image processing
import { getMembers } from '../../scripts/getMembers';
import sanitizeFilename from '../../utils/sanitizeFilename';
interface Member {
    team: string;
    name: string;
    desc: string;
    cover: string;
}

function extractMembersWithCover(members: any[]) {
    return members.filter((member) => member.cover);
}


async function ensureDirectoryExists(directoryPath: string): Promise<void> {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
        console.log(`Directory ${directoryPath} created.`);
    }
}

async function cleanupOldImages(membersFolderPath: string, validImageNames: string[]): Promise<void> {
    const files = fs.readdirSync(membersFolderPath);

    // Delete files that are not in the validImageNames list
    files.forEach((file: string) => {
        if (!validImageNames.includes(file)) {
            const filePath = path.join(membersFolderPath, file);
            fs.unlinkSync(filePath); // Synchronously delete the file
            console.log(`Deleted old image: ${file}`);
        }
    });
}

export async function GET() {
    const publicFolderPath = path.join(process.cwd(), 'public');
    const membersFolderPath = path.join(publicFolderPath, 'members'); // Path for storing member images

    // Ensure the 'members' directory exists
    await ensureDirectoryExists(membersFolderPath);

    const members = extractMembersWithCover(await getMembers()); // Extract image URLs from the get Members

    try {
        // Generate the list of valid image filenames (with .webp extension)
        const validImageNames = members.map((member: Member) => {
            const sanitizedFileName = sanitizeFilename(`${member.team}_${member.name}`); // Sanitize the filename
            return `${sanitizedFileName}.webp`;
        });

        await cleanupOldImages(membersFolderPath, validImageNames);

        const downloadPromises = members.map(async (member) => {
            const sanitizedFileName = sanitizeFilename(`${member.team}_${member.name}`);
            const imageName = `${sanitizedFileName}.webp`; // Unique filename for each image
            const imagePath = path.join(membersFolderPath, imageName);

            if (members.length === 0) {
                return new Response('No members with cover images found.', { status: 404 });
            }

            // Check if the WebP image already exists
            if (!fs.existsSync(imagePath)) {
                const response = await axios({
                    url: member.cover,
                    method: 'GET',
                    responseType: 'arraybuffer', // Download the image as an array buffer
                });

                // Convert and compress the image to WebP format
                const compressedImageBuffer = await sharp(response.data)
                    .webp({ quality: 80 }) // Set quality to control compression level
                    .resize({ width: 500 }) // Optionally resize the image to a max width
                    .toBuffer();

                // Save the compressed WebP image to the public folder
                fs.writeFileSync(imagePath, new Uint8Array(compressedImageBuffer)); // Cast Buffer to Uint8Array
                console.log(`Image ${imageName} downloaded, converted to WebP, and saved.`);

                return `Image ${imageName} downloaded, converted to WebP, and saved.`;
            } else {
                console.log(`Image ${imageName} already exists.`);
                return `Image ${imageName} already exists.`;
            }
        });

        // Wait for all downloads to complete
        const results = await Promise.all(downloadPromises);

        console.log('All images downloaded, converted to WebP, and saved.');

        return new Response(results.join('\n'), { status: 200 });
    } catch (error) {
        console.error('Error downloading or processing images:', error);
        return new Response('Failed to download or process some images.', { status: 500 });
    }
}
