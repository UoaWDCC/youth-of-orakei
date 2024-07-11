import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";


export async function getHomepageDescriptions(blocks : block[]): Promise<string> {

    // try importing the NOTION_TOKEN and NOTION_MEMBERS_ID from the .env file, throw an error if they are not found
    if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID)
        throw new Error("Missing secret(s)");

    // create a new Notion client with the token
    const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

    // create a query to get the database with the specified ID
    const query = await notion.databases.query({
        //todo: change the database_id to the homepage database
        database_id: import.meta.env.NOTION_MEMBERS_ID,
        sorts: [{
          property: 'Name',
          direction: 'ascending'
        }]
      });
    }



    return members;
}