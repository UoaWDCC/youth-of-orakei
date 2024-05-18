import { assert, expect, test } from 'vitest';
import fs from 'fs';

function readMarkdownFile(filePath: string): string | null {
  try {
    const markdownContent = fs.readFileSync(filePath, 'utf-8');
    return markdownContent;
  } catch (error) {
    console.error('Error reading Markdown file:', error);
    return null;
  }
}

const readMeFilePath = 'src/pages/posts/members.md';
const readMeText = readMarkdownFile(readMeFilePath);

test('Members.md exists', () => {
    expect(readMeText).toBeDefined();
})

test('The first line is in members.md', () => {
	expect(readMeText).toContain('This is a  **test.** ');
})

test('The second line is in members.md', () => {
	expect(readMeText).toContain('This is a new  *paragraph* ');
})

test('The link is in members.md', () => {
	expect(readMeText).toContain('[https://www.youtube.com/antga](https://www.youtube.com/antga) ');
})