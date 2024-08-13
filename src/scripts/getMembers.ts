import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { memberRow } from "../types/memberRow"


type MemberData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
}

export async function getMembers(): Promise<MemberData[]> {

    if (!process.env.NOTION_TOKEN || !process.env.NOTION_MEMBERS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: process.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    
      
    const memberspages = query.results as memberRow[];
    const members: MemberData[] = memberspages.map((row) => {
      return {
          team: row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "",
          desc: row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "",
          name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "",
          cover: row.cover?.type == "external" ? row.cover?.external.url : row.cover?.file.url  ?? ""
      };
  });
      
    return members;
}