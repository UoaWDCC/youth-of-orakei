import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { teamRow } from "../types/teamRow"


type TeamDescriptions = {
  name: string;
  desc?: string;
  tags?: string;
}

export async function getTeamsDescriptions(): Promise<TeamDescriptions[]> {

    if (!process.env.NOTION_TOKEN || !process.env.NOTION_TEAMS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: process.env.NOTION_TEAMS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    
    
  
    const teampages = query.results as teamRow[];
    
    const teams: TeamDescriptions[] = teampages.map((row) => {
        return {
          name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "",
          description: row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "",
          tags: row.properties.Tags.select.name ?  row.properties.Tags.select.name : "",
      };
  });
  
    return teams;
}