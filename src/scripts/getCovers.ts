import { Client } from "@notionhq/client";
import type { GetPageResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { page } from "../types/page";

type CoverData = {
  name: string;
  cover: string;
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

    // @ts-ignore
    const covers: CoverData[] = [{
      name: "temp",
      cover: "temp",
    }];

    return covers;
}