import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { projectRow } from "../types/projectRow"
import type { multiselect } from "../types/multiselect";

type ProjectData = {
  name: string;
  date: string;
  tags?: string[]; 
}

export async function getProjects(): Promise<ProjectData[]> {

    if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_PROJECTS_ID)
    throw new Error("Missing secret(s)");

    const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id: import.meta.env.NOTION_PROJECTS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });    
      
    const projectsRows = query.results as projectRow[];
    const projects: ProjectData[] = projectsRows.map((row) => {
        return {
            name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "",
            date: row.properties.Date.date ? row.properties.Date.date.start : "",
            tags: row.properties.Tags.multi_select.map((tag) => tag.name)
        };
    });
    console.log(projects)
    return projects;
}