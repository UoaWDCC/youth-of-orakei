import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";
import {getAnton} from "./getAnton.ts";
import {fetchPageBlocks} from "./fetchPageBlocks.ts";



export async function getDetails(): Promise<void> {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_MEMBERS_ID = process.env.NOTION_MEMBERS_ID;

  if (!NOTION_TOKEN || !NOTION_MEMBERS_ID) {
    throw new Error("Missing secret(s)");
  }

  // initialising the Notion client
  const notion = new Client({auth : NOTION_TOKEN});

  try {
    // Query the Notion database
    const query = await notion.databases.query({
      database_id: NOTION_MEMBERS_ID,
      sorts: [{property: 'Name', direction: 'ascending'}]
    });

    for (const page of query.results){
      if ('properties' in page){
        // @ts-ignore
        const title = page.properties.Name.title[0].plain_text || "Untitled";
        console.log(`Fetching data for ${title}`);
        const pageId = page.id;

        const block = await fetchPageBlocks(notion, pageId);
        const content= await getAnton(block);

        // defining file path to save markdown file to
        const filePath = './src/pages/posts/members.md';
        const extra = "---\ntitle: 'Taken from Notion'\nauthor: 'You'\n---"

        // writing markdown file to file path
        fs.writeFileSync(filePath, extra + content);
        console.log(`markdown file written successfully for ${title}`);

      }
    }

  } catch (error) {
      console.error('Error querying database:', error);
  }

}
