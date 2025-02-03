import { Client } from "@notionhq/client";
import { updateTeamsDescriptions } from "../../scripts/updateTeamDescription";
import type { APIRoute } from "astro";
import type { passwordRow } from "../../types/passwordRow";

function sendLog(controller: ReadableStreamDefaultController, message: string) {
  const logMessage = {
    message,
    timestamp: Date.now(),
  };
  controller.enqueue(
    new TextEncoder().encode(`data: ${JSON.stringify(logMessage)}\n\n`)
  );
}

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
        async start(controller) {
          try {
            sendLog(controller, "Starting teams refresh...");
            await updateTeamsDescriptions(controller);
            sendLog(controller, "Teams refresh completed");
            controller.close();
          } catch (error) {
            sendLog(controller, `Error: ${(error as Error).message}`);
            controller.close();
          }
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
