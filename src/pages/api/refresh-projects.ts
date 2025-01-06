import { Client } from "@notionhq/client";
import { updateProjects } from "../../scripts/updateProjects";
import type { APIRoute } from "astro";
import type { passwordRow } from "../../types/passwordRow";

export const POST: APIRoute = async ({ request }) => {
  const NOTION_TOKEN = process.env.NOTION_TOKEN || import.meta.env.NOTION_TOKEN;
  const NOTION_REFRESH_ID =
    process.env.NOTION_REFRESH_ID || import.meta.env.NOTION_REFRESH_ID;

  if (!NOTION_TOKEN || !NOTION_REFRESH_ID) {
    return new Response(JSON.stringify({ error: "Missing secret(s)" }), {
      status: 500,
    });
  }

  const notion = new Client({ auth: NOTION_TOKEN });

  try {
    const { password } = await request.json();

    const query = await notion.databases.query({
      database_id: NOTION_REFRESH_ID,
    });

    const passwords = query.results as passwordRow[];
    const notionPassword =
      passwords[0]?.properties.Password.title[0]?.text.content;

    if (!notionPassword || password !== notionPassword) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

    return new Response(
      new ReadableStream({
        start(controller) {
          updateProjects(controller);
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Error during request handling:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
