import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";

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

    type Row = {
        // Do this part
    };

    const query = await notion.databases.query({
        database_id: import.meta.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    

    // @ts-ignore
    const members: MemberData[] = [{
      team: "temp",
      desc: "temp",
      name: "temp",
      cover: "temp",
    }];

    return members;
}