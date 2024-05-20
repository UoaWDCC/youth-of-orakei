import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { memberRow } from "../types/memberRow"

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

    const query = await notion.databases.query({
        database_id: import.meta.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    
  
    const members: MemberData[] = query.results.map((row) => {
      return {
          //@ts-ignore
          team: row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "",
          //@ts-ignore
          desc: row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "",
          //@ts-ignore
          name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : ""
      };
  });
      
    return members;
}