import { Client } from "@notionhq/client";
import type { page } from "../types/page";

type CoverData = {
  name: string;
  cover: string | undefined;
}

export async function getCovers(): Promise<CoverData[]> {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_MEMBERS_ID = process.env.NOTION_MEMBERS_ID || import.meta.env.NOTION_MEMBERS_ID;
    if (!NOTION_TOKEN|| !NOTION_MEMBERS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    

    const pages = query.results as page[];
    
    const covers: CoverData[] = pages.map((row) => {
      return { 
        name: row.properties ? row.properties.Name.title[0].plain_text : "",
        cover: row.cover?.type == "external" ? row.cover?.external.url : row.cover?.file.url
      }
    });

    return covers;
}