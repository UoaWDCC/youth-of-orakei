import type { rich_text } from "./richText"

export type memberRow = {
    Name: {id: string, type: string, title: rich_text[]},
    Description: {id: string, type: string, rich_text: rich_text[]},
    Team: {id: string, type: string, rich_text: rich_text[]}
}