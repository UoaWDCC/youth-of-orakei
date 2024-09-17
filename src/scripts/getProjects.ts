import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp';
import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getPage } from "./getPageDescriptions.ts";
import type { projectRow } from '../types/projectRow.ts';
import sanitizeFilename from '../utils/sanitizeFilename.ts';

type ProjectData = {
  title: string;
  date: string;
  description: string;
  cover: string;
  team: string;
  tags: string[]; // Make tags required as an empty array
  id: string;
}

type CarouselItem = {
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

  return `/projects/${fileName}.webp`; // Return the public path for the image
}

export async function getProjects(): Promise<{ projects: ProjectData[], carouselList: CarouselItem[] }> {
  const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  const NOTION_PROJECTS_ID = process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

  if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
    throw new Error("Missing secret(s)");
  }

  const notion = new Client({ auth: NOTION_TOKEN });
  const publicFolderPath = path.join(process.cwd(), 'public');
  const projectsFolderPath = path.join(publicFolderPath, 'projects');

  await ensureDirectoryExists(projectsFolderPath);

  const query = await notion.databases.query({
    database_id: NOTION_PROJECTS_ID,
    sorts: [{ property: 'Date', direction: 'descending' }]
  });

  const projectsRows = query.results as projectRow[];
  const carouselList: CarouselItem[] = [];

  const projectPromises = projectsRows.map(async (row) => {
    const title = row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "";
    const date = row.properties.Date.date ? row.properties.Date.date.start : "";
    const description = row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "";
    const coverUrl = row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? "";
    const team = row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "";
    const tags = row.properties.Tags?.multi_select.map((tag) => tag.name) || []; // Ensure tags is always an array
    const id = row.id || "";

    let coverPath = "";

    if (coverUrl) {
      coverPath = await downloadAndProcessImage(coverUrl, projectsFolderPath, sanitizeFilename(title) + "_cover");
    }

    if (title.toLowerCase().includes("carousel content")) {
      const pageId: string = id;
      const blocks = await fetchPageBlocks(notion, pageId);
      const { subheadings, paragraphs, images } = await getPage(blocks);

      carouselList.push({
        heading: subheadings[0],
        subheadings,
        paragraphs,
        images: await Promise.all(
          images.map((url, idx) =>
            downloadAndProcessImage(url, projectsFolderPath, `${sanitizeFilename(title)}_image_${idx}`)
          )
        )
      });

      return null; // Filter out carousel content from main projects list
    }

    return {
      title,
      date,
      description,
      cover: coverPath, // Updated to point to the local path
      team,
      tags, // No need for type assertion here
      id
    };
  });

  // Filter out null values and await all async operations
  const filteredProjects = (await Promise.all(projectPromises)).filter((project): project is ProjectData => project !== null);

  // Save the projects and carousel list to JSON files
  const projectsJsonPath = path.join(projectsFolderPath, 'projectsData.json');
  fs.writeFileSync(projectsJsonPath, JSON.stringify(filteredProjects, null, 2));
  console.log(`Projects data saved to ${projectsJsonPath}`);

  const carouselJsonPath = path.join(projectsFolderPath, 'carouselList.json');
  fs.writeFileSync(carouselJsonPath, JSON.stringify(carouselList, null, 2));
  console.log(`Carousel list data saved to ${carouselJsonPath}`);

  return {
    projects: filteredProjects,
    carouselList
  };
}
