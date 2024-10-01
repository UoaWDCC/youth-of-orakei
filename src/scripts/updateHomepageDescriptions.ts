import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getPage } from "./getPageDescriptions.ts";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Description = {
    heading: string;
    subheadings: string[];
    paragraphs: string[];
    images: string[];
};

export async function updateHomepageDescriptions(): Promise<void> {
    const descriptions: Record<string, Description> = {};

    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_HOMEPAGE_ID = process.env.NOTION_HOMEPAGE_ID || import.meta.env.NOTION_HOMEPAGE_ID;

    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID) throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });

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

                    // Upsert the homepage description into the database
                    await prisma.homepageDescription.upsert({
                        where: { heading: title },
                        update: {
                            subheadings,
                            paragraphs,
                            images, // Directly store the Notion image URLs
                        },
                        create: {
                            heading: title,
                            subheadings,
                            paragraphs,
                            images, // Directly store the Notion image URLs
                        },
                    });

                    descriptions[title] = {
                        heading: title,
                        subheadings,
                        paragraphs,
                        images, // Store the Notion image URLs
                    };
                }
            }
        }

      

    } catch (error) {
        console.error("Error retrieving or processing homepage descriptions:", error);
    } finally {
        await prisma.$disconnect(); // Disconnect Prisma client
    }
}
