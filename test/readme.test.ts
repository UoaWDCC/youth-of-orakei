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

test('README exists', () => {
	const string = readMarkdownFile(readMeFilePath);
	expect(string).toBeDefined();
})

test('Houston exists', () => {
	const string = readMarkdownFile(readMeFilePath);
	expect(string).toContain("Houston");
})