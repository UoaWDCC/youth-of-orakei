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

const readMeFilePath = 'README.md';
const readMeText = readMarkdownFile(readMeFilePath);

test('README exists', () => {
	expect(readMeText).toBeDefined();
})

test('Houston is on the README', () => {
	expect(readMeText).toContain("Houston");
})

test('Chris is on the README', () => {
	expect(readMeText).toContain("Chris");
})