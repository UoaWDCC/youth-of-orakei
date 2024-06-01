import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";
import type {BlockObjectRequest} from "@notionhq/client/build/src/api-endpoints";

//
type MemberDate = {
  team:string;
  desc:string;
  name:string;
  cover?:string;
  url?:string;
}

type Block = BlockObjectRequest;

export async function getDetails(): Promise<void>{
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
      sorts: [{ property: 'Name', direction: 'ascending' }]
    });

    // iterating through all the pages in the database, and running the get

  }
