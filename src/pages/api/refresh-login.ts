import { Client } from "@notionhq/client";
import bcrypt from 'bcrypt';
import { getMembers } from "../../scripts/getMembers.ts";
import { getProjects } from "../../scripts/getProjects.ts";
import { getHomepageDescriptions } from "../../scripts/getHomepageDescriptions.ts";
import type { APIRoute } from 'astro';
import type { passwordRow } from "../../types/passwordRow.ts";

interface NotionPassword {
    password: string;
    newPassword?: string; 
    action: 'login' | 'refresh' | 'change-password';
}

 

export const POST: APIRoute = async ({ request }) => {
    const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
    const NOTION_REFRESH_ID = process.env.NOTION_REFRESH_ID || import.meta.env.NOTION_REFRESH_ID;

    if (!NOTION_TOKEN || !NOTION_REFRESH_ID) {
        return new Response(JSON.stringify({ error: "Missing secret(s)" }), { status: 500 });
    }

    const notion = new Client({ auth: NOTION_TOKEN });

    try {
        const { password, newPassword, action } = await request.json() as NotionPassword;

        const query = await notion.databases.query({
            database_id: NOTION_REFRESH_ID,
        });

        const passwords = query.results as passwordRow[];

        if (passwords.length === 0 || !passwords[0].properties.Password.title) {
            return new Response(JSON.stringify({ error: "Password not found in Notion database" }), { status: 500 });
        }

        const notionPassword = passwords[0].properties.Password.title[0]?.text.content;

        if (!notionPassword) {
            return new Response(JSON.stringify({ error: "No password stored in Notion database" }), { status: 500 });
        }

        if (action === 'login') {
            if (!password) {
                return new Response(JSON.stringify({ error: "Password is required" }), { status: 400 });
            }
            
            const isMatch = await bcrypt.compare(password, notionPassword);
            console.log("Login password match result:", isMatch); // Debug logging
            
            if (isMatch) {
                return new Response(JSON.stringify({ success: true }), { status: 200 });
            } else {
                return new Response(JSON.stringify({ success: false, message: "Invalid password" }), { status: 401 });
            }
        } else if (action === 'refresh') {
            if (!password) {
                return new Response(JSON.stringify({ error: "Password is required" }), { status: 400 });
            }
            
            const isMatch = await bcrypt.compare(password, notionPassword);
            console.log("Refresh password match result:", isMatch); // Debug logging
            
            if (isMatch) {
                try {
                    await getMembers();
                    await getProjects();
                    await getHomepageDescriptions();
                    return new Response(JSON.stringify({ success: true }), { status: 200 });
                } catch (err) {
                    console.error("Error during refresh data:", err);
                    return new Response(JSON.stringify({ error: "Failed to refresh data" }), { status: 500 });
                }
            } else {
                return new Response(JSON.stringify({ success: false, message: "Invalid password" }), { status: 401 });
            }
        } else if (action === 'change-password') {
            if (!newPassword) {
                return new Response(JSON.stringify({ error: "New password is required" }), { status: 400 });
            }
            
            const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
            
            await notion.pages.update({
                page_id: passwords[0].id as string,
                properties: {
                    Password: {
                        title: [
                            {
                                text: {
                                    content: newHashedPassword,
                                },
                            },
                        ],
                    },
                },
            });

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }
    } catch (error) {
        console.error("Error during request handling:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
};
