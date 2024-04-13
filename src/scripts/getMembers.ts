import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";

export async function getBlocks(): Promise<any[]> {

  if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID)
  throw new Error("Missing secret(s)");

  const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

  // API call to get all the blocks in an array of JSON
  (async () => {
    const blockId = import.meta.env.NOTION_PAGE_ID;
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 50,
    });

    const blocks = response.results;
    
    var full_text = "";
    
    for (var i = 0; i < blocks.length; i++) {
        var current_block = blocks[i] as block;
       
        // Put your code here

     }
 
  const filePath = './src/pages/posts/output.md';

  const extra = "---\nlayout: ../../layouts/MarkdownPostLayout.astro\ntitle: 'Taken from Notion'\nauthor: 'You'\n---"


  // Write the Markdown content to the file
  fs.writeFile(filePath, extra + "  \n" + full_text, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('Markdown file written successfully.');
    }
  });

  })();

  return [0];

}