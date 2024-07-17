import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";
import {getAnton} from "./getAnton.ts";
import {fetchPageBlocks} from "./fetchPageBlocks.ts";


export async function getHomepageDescriptions(blocks : block[]): Promise<any> {

    // try importing the NOTION_TOKEN and NOTION_MEMBERS_ID from the .env file, throw an error if they are not found
    if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID)
        throw new Error("Missing secret(s)");

    // create a new Notion client with the token
    const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

    // create a query to get the database with the specified ID
    try {
        const query = await notion.databases.query({
            // todo: change the database_id to the homepage database
            database_id: import.meta.env.NOTION_MEMBERS_ID,
            sorts: [{
                property: 'Name',
                direction: 'ascending'
            }]
        });

        // going through all the pages in the database
        for (const page of query.results){
            if ('properties' in page){
                // @ts-ignore
                // retrieving the title of page, e.g 'What we do'
                const title = page.properties.Name.title[0].plain_text || "Untitled";
                // retrieve the contents of the page, using the getAnton function
                const pageId = page.id;

                const block = await fetchPageBlocks(notion, pageId);
                const content= await getAnton(block);
            }
        }
    } catch (error) {
        console.error(error);
        return [];
    }
}