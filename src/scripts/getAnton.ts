import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";

type MemberData = {
    team: string;
    desc: string;
    name: string;
    cover: string;
    url?: string;
}

export async function getAnton(blocks : block[]): Promise<string> {

    var full_text = "";

    for (const current_block of blocks) {
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

  //   const filePath = './src/pages/posts/members.md';
  //
  //   const extra = "---\ntitle: 'Taken from Notion'\nauthor: 'You'\n---"
  //
  //   // layout: ../../layouts/MarkdownPostLayout.astro\n
  //
  //   // Write the Markdown content to the file
  //   fs.writeFile(filePath, extra + "  \n" + full_text, (err) => {
  //     if (err) {
  //       console.error('Error writing file:', err);
  //     } else {
  //       console.log('Markdown file written successfully.');
  //     }
  //   });
  //
  // })();

  return full_text;

}