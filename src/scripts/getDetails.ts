import { Client } from "@notionhq/client";
import * as fs from "fs";
import { type block } from "../types/block";

export async function getDetails(): Promise<any[]> {
  // Check if the secret(s) are missing 
  if (!import.meta.env.NOTION_TOKEN || !import.meta.env.NOTION_MEMBERS_ID) {
    throw new Error("Missing secret(s)");
  }

  // Create a new Notion client 
  const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });  

  return [];  

}