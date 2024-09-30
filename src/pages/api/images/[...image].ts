import fs from 'fs';
import path from 'path';
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params }) => {
    // Check if params.image is defined
    const imageParam = params.image as string; // Cast to string
    if (!imageParam) {
        return new Response('Image not specified', { status: 400 });
    }

    const imagePath = path.join('data', 'members', imageParam); // Use the imageParam directly

    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        return new Response(imageBuffer, {
            headers: {
                'Content-Type': 'image/webp', // Adjust the content type as necessary
            },
        });
    } else {
        return new Response('Image not found', { status: 404 });
    }
};
