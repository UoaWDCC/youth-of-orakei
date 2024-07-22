import {Client} from "@notionhq/client";
import {getAnton} from "./getAnton.ts";
import {fetchPageBlocks} from "./fetchPageBlocks.ts";

export async function getHomepageDescriptions(): Promise<any> {
    let descriptions = new Map<string, string>();

    const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
    // todo: change the database_id to the homepage database
    const NOTION_HOMEPAGE_ID = import.meta.env.NOTION_MEMBERS_ID

    // try importing the NOTION_TOKEN and NOTION_MEMBERS_ID from the .env file, throw an error if they are not found
    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID)
        throw new Error("Missing secret(s)");

    // create a new Notion client with the token
    const notion = new Client({auth: NOTION_TOKEN });
    // create a query to get the database with the specified ID
    try {
        const query = await notion.databases.query({
            database_id: NOTION_HOMEPAGE_ID,
            sorts: [{
                property: 'Name',
                direction: 'ascending'
            }]
        });

        // going through all the pages in the database
        for (const page of query.results) {
            if ('properties' in page){
                // @ts-ignore
                // retrieving the title of page, e.g 'What we do'
                const title: string  = String((page.properties.Name.title[0] && page.properties.Name.title[0].plain_text) || "Untitled");
                // retrieve the contents of the page, using the getAnton function
                const pageId : string  = page.id;

                const block = await fetchPageBlocks(notion, pageId);
                descriptions.set(title,  (await getAnton(block)));
            }

        }

    } catch (error) {
        console.error(error);
        return [];
    }
    return descriptions;
}