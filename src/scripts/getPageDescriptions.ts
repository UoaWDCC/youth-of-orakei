import { Client } from "@notionhq/client";
import type { block } from "../types/block";

export async function getPage(blocks: block[]): Promise<{ subheadings: string[], paragraphs: string[] }> {
    const subheadings: string[] = [];
    const paragraphs: string[] = [];
    const images: string[] = [];

    for (const current_block of blocks) {
        // Handle headings
        if (current_block.type === "heading_1" || current_block.type === "heading_2" || current_block.type === "heading_3") {
            const headingText = current_block[current_block.type]?.rich_text[0]?.text.content;
            if (headingText) {
                subheadings.push(headingText);
            }
        }
        // Handle paragraphs
        else if (current_block.type === "paragraph") {
            let paragraphText = "";
            for (const text of current_block.paragraph?.rich_text || []) {
                let currentText = text.text.content;

                // Check for bold and italic formatting
                if (text.annotations.bold && text.annotations.italic) {
                    currentText = `***${currentText}***`;
                } else if (text.annotations.bold) {
                    currentText = `**${currentText}**`;
                } else if (text.annotations.italic) {
                    currentText = `*${currentText}*`;
                }

                // Check for links
                if (text.text.link) {
                    currentText = `[${currentText}](${text.text.link.url})`;
                }

                paragraphText += currentText + " ";
            }
            paragraphs.push(paragraphText.trim());
        }

        // Handle images
        else if (current_block.type === "image" && current_block.image) {
            let imageUrl = "";
            if (current_block.image.type === "external") {
                imageUrl = current_block.image.file?.url || "";
            } else if (current_block.image.type === "file") {
                imageUrl = current_block.image.file?.url || "";
            }
            if (imageUrl) {
                images.push(imageUrl);
            }
        }
    }

    return { subheadings, paragraphs, images };
}
