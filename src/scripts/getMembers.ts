import { Client } from "@notionhq/client";
import fs from "fs/promises";
import path from "path";
import type { memberRow } from "../types/memberRow";

type MemberData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
};

const MEMBERS_FILE_PATH = path.resolve("./public/membersData.json");

// Function to write members data to a file
async function writeMembersToFile(members: MemberData[]): Promise<void> {
  try {
    await fs.writeFile(MEMBERS_FILE_PATH, JSON.stringify(members, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing members to file:", error);
  }
}

// Function to read members data from a file
async function readMembersFromFile(): Promise<MemberData[] | null> {
  try {
    const fileContent = await fs.readFile(MEMBERS_FILE_PATH, "utf8");
    return JSON.parse(fileContent) as MemberData[];
  } catch (error) {
    console.error("Error reading members from file:", error);
    return null;
  }
}

export async function getMembers(): Promise<MemberData[]> {
  // Check if file exists and read from it
  const cachedMembers = await readMembersFromFile();
  if (cachedMembers) {
    return cachedMembers;
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  const NOTION_MEMBERS_ID = process.env.NOTION_MEMBERS_ID || import.meta.env.NOTION_MEMBERS_ID;

  if (!NOTION_TOKEN || !NOTION_MEMBERS_ID)
    throw new Error("Missing secret(s)");

  const notion = new Client({ auth: NOTION_TOKEN });

  const query = await notion.databases.query({
    database_id: NOTION_MEMBERS_ID,
    sorts: [
      {
        property: "Name",
        direction: "ascending",
      },
    ],
  });

  const memberspages = query.results as memberRow[];
  const members: MemberData[] = memberspages.map((row) => {
    return {
      team: row.properties.Team.rich_text[0] ? row.properties.Team.rich_text[0].plain_text : "",
      desc: row.properties.Description.rich_text[0] ? row.properties.Description.rich_text[0].plain_text : "",
      name: row.properties.Name.title[0] ? row.properties.Name.title[0].plain_text : "",
      cover: row.cover?.type === "external" ? row.cover?.external.url : row.cover?.file.url ?? "",
    };
  });

  // Save members to file
  await writeMembersToFile(members);

  return members;
}
