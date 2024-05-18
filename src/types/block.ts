import { type rich_text } from './richText';

export type block = {
    object: string,
    id: string,
    parent: { type: string, page_id: string },
    created_time: string,
    last_edited_time: string,
    created_by: {object: string, id: string},
    last_edited_by: {object: string, id: string},
    has_children: boolean,
    archived: boolean,
    type: string,
    heading_1?: {rich_text: rich_text[], is_toggleable?: boolean, color: string},
    heading_2?: {rich_text: rich_text[], is_toggleable?: boolean, color: string},
    heading_3?: {rich_text: rich_text[], is_toggleable?: boolean, color: string},
    paragraph?: {rich_text: rich_text[], is_toggleable?: boolean, color: string},
    image?: {caption: string, type: string, file: {url: string, expiry_time: string},},
    bookmark?: {caption: any, url: string},
};