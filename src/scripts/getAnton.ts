import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";

export async function getAnton(): Promise<any[]> {

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
       
        // Checks what kind of heading it is and adds to the text
        if (current_block.type === "heading_1") {
          full_text += `# ${current_block.heading_1?.rich_text[0].text.content}\n`;
        } else if (current_block.type === "heading_2") {
          full_text += `# ${current_block.heading_2?.rich_text[0].text.content}\n`;
        } else if (current_block.type === "heading_3") {
          full_text += `# ${current_block.heading_3?.rich_text[0].text.content}\n`;
        }
        // Checks if its paragraph
        else if (current_block.type === "paragraph") {
          // Loops through the paragraph
          for (const text of current_block.paragraph?.rich_text || []) {
            let currentText = text.text.content;
            // Checks bold + italics and formats it correctly
            if (text.annotations.bold && text.annotations.italic) {
              currentText = `***${currentText}***`;
            } else if (text.annotations.bold) {
              currentText = `**${currentText}**`;
            } else if (text.annotations.italic) {
              currentText = `*${currentText}*`;
            }
            // Checks links and formats it correctly
            if (text.text.link) {
              currentText = `[${currentText}](${text.text.link.url})`;
            }
            full_text += currentText + " ";
          }
        }
        full_text += "\n";
    }
 
  const filePath = './src/pages/posts/members.md';

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