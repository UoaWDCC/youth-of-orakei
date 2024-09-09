import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getMembers } from '../../scripts/getMembers';

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
        // Generate the list of valid image filenames
        const validImageNames = members.map((member: Member) => {
            return `${member.team.replace(/ /g, '_')}_${member.name.replace(/ /g, '_')}.jpg`;
        });

        await cleanupOldImages(membersFolderPath, validImageNames);

        const downloadPromises = members.map(async (member, index) => {
            const imageName = `${member.team.replace(/ /g, '_')}_${member.name.replace(/ /g, '_')}.jpg`; // Unique filename for each image
            const imagePath = path.join(membersFolderPath, imageName);

            if (members.length === 0) {
                return new Response('No members with cover images found.', { status: 404 });
            }

            if (!fs.existsSync(imagePath)) {
                const response = await axios({
                    url: member.cover,
                    method: 'GET',
                    responseType: 'stream',
                });

                // Save the image to the public folder
                response.data.pipe(fs.createWriteStream(imagePath));
                return new Promise((resolve, reject) => {
                    response.data.on('end', () => {
                        console.log(`Image ${imageName} downloaded and saved.`);
                        resolve(`Image ${imageName} downloaded and saved.`);
                    });
                    response.data.on('error', reject);
                });
            } else {
                console.log(`Image ${imageName} already exists.`);
                return `Image ${imageName} already exists.`;
            }
        });

        // Wait for all downloads to complete
        const results = await Promise.all(downloadPromises);

        console.log('All images downloaded and saved.');

        return new Response(results.join('\n'), { status: 200 });
    } catch (error) {
        console.error('Error downloading images:', error);
        return new Response('Failed to download some images.', { status: 500 });
    }
}
