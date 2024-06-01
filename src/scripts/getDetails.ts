import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";
import type {BlockObjectRequest} from "@notionhq/client/build/src/api-endpoints";
import {getMembers} from "./getMembers.ts";
import {getAnton} from "./getAnton.ts";

// define the type of the data that we are going to get from the Notion database
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
      sorts: [{property: 'Name', direction: 'ascending'}]
    });

    for (const page of query.results){
      if ('properties ' in page){
        const title = page.properties.Name?.title[0].plain_text || "Untitled";
        const pageId = page.id;

        const block = await getMembers();
        const content= await getAnton(block);


      }
    }

  } catch (error) {
      console.error('Error querying database:', error);
  }

}

async function fetchPageBlocks(notion : Client, blockID: string) : Promise<block[]>{
  const blocks: block[] = [];

  do {
    const response = await notion.bl
  }
}