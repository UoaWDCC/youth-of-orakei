import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getAnton } from "./getAnton.ts";
export async function getHomepageDescriptions(): Promise<Map<string, { heading: string, subheadings: string[], paragraphs: string[] }>> {
    let descriptions = new Map<string, { heading: string, subheadings: string[], paragraphs: string[] }>();

    const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
    const NOTION_HOMEPAGE_ID = import.meta.env.NOTION_HOMEPAGE_ID;

    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID) throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        const query = await notion.databases.query({
            database_id: NOTION_HOMEPAGE_ID,
            sorts: [{ property: 'Name', direction: 'ascending' }]
        });

        for (const page of query.results) {
            if ('properties' in page) {
                const title: string = String((page.properties.Name.title[0]?.plain_text) || "Untitled");
                const pageId: string = page.id;
                const blocks = await fetchPageBlocks(notion, pageId);
                const { subheadings, paragraphs } = await getAnton(blocks);

                descriptions.set(title, {
                    heading: title,
                    subheadings,
                    paragraphs
                });
            }
        }

    } catch (error) {
        console.error(error);
        return new Map();
    }
    console.log(descriptions)
    return descriptions;
}
