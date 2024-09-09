import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { getMembers } from '../../scripts/getMembers';

function extractMembersWithCover(members: any[]) {
    return members.filter((member) => member.cover);
}

export async function GET() {
    const publicFolderPath = path.join(process.cwd(), 'public');
    const members = extractMembersWithCover(await getMembers()); // Extract image URLs from the get Members


    try {
        const downloadPromises = members.map(async (member, index) => {
            const imageName = `${member.team.replace(/ /g, '_')}_${member.name.replace(/ /g, '_')}.jpg`; // Unique filename for each image
            const imagePath = path.join(publicFolderPath, imageName);

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
