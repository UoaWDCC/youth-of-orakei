import { Client } from "@notionhq/client";
import type { page } from "../types/page";

type CoverData = {
  name: string;
  cover: string | undefined;
}

export async function getCovers(): Promise<CoverData[]> {

    if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: import.meta.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    

    const pages = query.results as page[];

    const covers: CoverData[] = pages.map((row) => {
      return { 
        name: row.properties ? row.properties.Name.title[0].plain_text : "",
        cover: row.cover?.external.url
      }
    });

    return covers;
}