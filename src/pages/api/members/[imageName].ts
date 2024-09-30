// src/pages/api/members/[imageName].ts
import fs from 'fs';
import path from 'path';

export async function get({ params  } : {params : any}) {
  const { imageName } = params;

  // Path to the image in the Fly.io volume
  const imagePath = path.join("/data", "members", imageName);

  // Check if the file exists
  if (fs.existsSync(imagePath)) {
    // Read the image file
    const fileBuffer = fs.readFileSync(imagePath);

    // Return the image as the response
    return {
      body: fileBuffer,
      headers: {
        'Content-Type': 'image/webp',
      },
    };
  } else {
    return {
      status: 404,
      body: 'Image not found',
    };
  }
}
