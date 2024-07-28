import {Client} from "@notionhq/client";
import type {block} from "../types/block.ts";

export async function fetchPageBlocks(notion : Client, blockID: string) : Promise<block[]>{
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