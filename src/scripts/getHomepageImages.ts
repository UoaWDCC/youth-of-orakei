import {Client} from "@notionhq/client";
import type {page} from "../types/page.ts";

const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
const NOTION_HOMEPAGE_ID = import.meta.env.NOTION_HOMEPAGE_ID;

type HomepageData = {
    name: string;
    cover: string | undefined;
}
export async function getHomepageImages(): Promise<any> {

    if (!NOTION_TOKEN || !NOTION_HOMEPAGE_ID){
        throw new Error("Missing secret(s)");
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    const query = await notion.databases.query({
        database_id : NOTION_TOKEN,
        sorts : [{
            property: 'Name',
            direction: 'ascending'
        }]
    });


    const pages = query.results as page[];

    const images : HomepageData[] = pages.map((row) => {
        return {
            name: row.properties ? row.properties.Name.title[0].plain_text : "",
            cover: row.cover?.type == "external" ? row.cover?.external.url : row.cover?.file.url
        }
    });

    return images;
}

