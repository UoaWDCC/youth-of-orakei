import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import type { rich_text } from "./richText";
import type { cover } from "./cover";

export type teamRow = {
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
      Name: { id: string, type: string, title: rich_text[] }
      Tags: { id: string, type: string, select: 
        {
        id: string,
        name: string,
        color: string
      }},
      Description: { id: string, type: string, rich_text: rich_text[] },
    },
    url: string,
    public_url: string,
    title: Array<RichTextItemResponse>,
    description: Array<RichTextItemResponse>,
    is_inline: boolean,
  };