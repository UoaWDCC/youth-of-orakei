import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { any } from "astro/zod";

type MemberData = {
  team: string;
  desc: string;
  name: string;
  cover?: string;
  url?: string;
}

export async function getMembers(): Promise<MemberData[]> {

    if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

    const query: any = await notion.databases.query({
        database_id: import.meta.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });   
    
    console.log(query.results[0].properties)
    
    query.results.map((results: any) => {})

    // @ts-ignore
    const members: MemberData[] = [{
      team: "temp",
      desc: "temp",
      name: "temp",
    }];

    return members;
}