import { Client } from "@notionhq/client";
import type { GetPageResponse } from "@notionhq/client/build/src/api-endpoints";
import type { projectRow } from "../types/projectRow";
import type { multiselect } from "../types/multiselect";

type ProjectData = {
  title: string;
  date: string;
  description: string;
  cover: string;
  team: string;
  tags?: string[];
}

export async function getProjects(): Promise<ProjectData[]> {
  const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  const NOTION_PROJECTS_ID = process.env.NOTION_PROJECTS_ID || import.meta.env.NOTION_PROJECTS_ID;

  if (!NOTION_TOKEN || !NOTION_PROJECTS_ID) {
    throw new Error("Missing secret(s)");
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  const query = await notion.databases.query({
    database_id: NOTION_PROJECTS_ID,
    sorts: [{
      property: 'Date',
      direction: 'descending'
    }]
  });

  const projectsRows = query.results as projectRow[];
  const projects: ProjectData[] = projectsRows.map((row) => {
    return {
      title: row.properties.Name.title[0]?.plain_text || "",  // Safely accessing 'Name'
      date: row.properties.Date?.date?.start || "",  // Safely accessing 'Date'
      description: row.properties.Description?.rich_text[0]?.plain_text || "",  // Safely accessing 'Description'
      cover: row.cover?.type === "external" ? row.cover.external.url : row.cover?.file?.url || "",  // Safely accessing 'cover'
      team: row.properties.Team?.rich_text[0]?.plain_text || "",  // Safely accessing 'Team'
      tags: row.properties.Tags?.multi_select.map((tag) => tag.name) || []  // Safely accessing 'Tags'
    };
  });

  console.log(projects);
  return projects;
}
