import { Client } from "@notionhq/client";
import { fetchPageBlocks } from "./fetchPageBlocks.ts";
import { getPage } from "./getPageDescriptions.ts";
export async function getHomepageDescriptions(): Promise<Map<string, { heading: string, subheadings: string[], paragraphs: string[] }>> {
  let descriptions = new Map<string, { heading: string, subheadings: string[], paragraphs: string[] }>();

  const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
  const NOTION_HOMEPAGE_ID = import.meta.env.NOTION_MEMBERS_ID

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
          const title: string = (nameProperty.title[0] as { plain_text: string }).plain_text;
          const pageId: string = page.id;
          const blocks = await fetchPageBlocks(notion, pageId);
          const { subheadings, paragraphs } = await getPage(blocks);
          descriptions.set(title, {
            heading: title,
            subheadings,
            paragraphs
          });
        } else {
          console.warn(`Page with ID ${page.id} has no title.`);
        }
      }
    }
  } catch (error) {
    console.error(error);
    return new Map();
  }
  return descriptions;
}
