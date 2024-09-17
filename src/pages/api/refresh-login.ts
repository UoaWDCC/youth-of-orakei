import { Client } from "@notionhq/client";
import { getMembers } from "../../scripts/getMembers.ts";
import { getProjects } from "../../scripts/getProjects.ts";
import { getHomepageDescriptions } from "../../scripts/getHomepageDescriptions.ts";
import type { APIRoute } from 'astro';
import type { passwordRow } from "../../types/passwordRow.ts";

interface NotionPassword {
    password: string;
}

export const POST: APIRoute = async ({ request }) => {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_REFRESH_ID = process.env.NOTION_REFRESH_ID || import.meta.env.NOTION_REFRESH_ID;

    if (!NOTION_TOKEN || !NOTION_REFRESH_ID) {
        return new Response(JSON.stringify({ error: "Missing secret(s)" }), { status: 500 });
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        const { password } = await request.json() as NotionPassword;

        const query = await notion.databases.query({
            database_id: NOTION_REFRESH_ID,
        });

        const passwords = query.results as passwordRow[];

        if (passwords.length === 0 || !passwords[0].properties.Password.title) {
            return new Response(JSON.stringify({ error: "Password not found in Notion database" }), { status: 500 });
        }

        const notionPassword = passwords[0].properties.Password.title[0]?.plain_text;

        if (password === notionPassword) {
            // If password matches, run the necessary functions
            await getMembers();
            await getProjects();
            await getHomepageDescriptions();

            // Respond with success
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            // Respond with failure if the password is incorrect
            return new Response(JSON.stringify({ success: false, message: "Invalid password" }), { status: 401 });
        }
    } catch (error) {
        console.error("Error during request handling:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};
