import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { rich_text } from "./richText";
import type { cover } from "./cover";

export type passwordRow = {
    object: string,
    id: string,
    created_time: string,
    last_edited_time: string,
    created_by: { object: string, id: string },
    last_edited_by: { object: string, id: string },
    cover: cover,
    icon: null,
    parent: {
      type: string,
      database_id: string
    },
    archived: boolean,
    in_trash: boolean,
    properties: {  
        Password: { id: string, type: string, title: rich_text[] }
    },
    url: string,
    public_url: string,
    title: Array<RichTextItemResponse>,
    description: Array<RichTextItemResponse>,
    is_inline: boolean,
  };