import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";
import {getAnton} from "./getAnton.ts";



export async function getDetails(): Promise<void> {
  const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
  const NOTION_MEMBERS_ID = import.meta.env.NOTION_MEMBERS_ID;

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

async function fetchPageBlocks(notion : Client, blockID: string) : Promise<block[]>{
  const blocks: block[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockID,
      start_cursor: cursor,
      page_size: 50,
    });
    blocks.push(...response.results as block[]);
    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return blocks;
}