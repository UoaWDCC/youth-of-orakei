import {describe, it, expect, vi, test} from "vitest";
import { getHomepageDescriptions } from "../src/scripts/getHomepageDescriptions";
import { getAnton } from "../src/scripts/getAnton";
import { fetchPageBlocks } from "../src/scripts/fetchPageBlocks";

vi.mock("../src/scripts/getAnton");
vi.mock("../src/scripts/fetchPageBlocks");

describe("getHomepageDescriptions", () => {
  it("should return a map of homepage descriptions", async () => {
    // Mock data
    const mockPageBlocks = [{}, {}];
    const mockAnton = "Sample description";

    const mockQueryResults = [
      {
        id: "page1",
        properties: {
          Name: {
            title: [{ plain_text: "Page 1" }]
          }
        }
      },
      {
        id: "page2",
        properties: {
          Name: {
            title: [{ plain_text: "Page 2" }]
          }
        }
      }
    ];

    // Mock fetchPageBlocks and getAnton
    (fetchPageBlocks as jest.Mock).mockResolvedValue(mockPageBlocks);
    (getAnton as jest.Mock).mockResolvedValue(mockAnton);

    // Mock Notion client
    vi.stubEnv("NOTION_TOKEN", "test-token");
    vi.stubEnv("NOTION_MEMBERS_ID", "test-database-id");

    const notionClientMock = {
      databases: {
        query: vi.fn().mockResolvedValue({ results: mockQueryResults }),
      },
    };

    const { Client } = await import("@notionhq/client");
    (Client as jest.Mock).mockReturnValue(notionClientMock);

    const descriptions = await getHomepageDescriptions();

    expect(descriptions.size).toBe(2);
    expect(descriptions.get("Page 1")).toBe("Sample description");
    expect(descriptions.get("Page 2")).toBe("Sample description");
  });
});

test ("getAnton", async () => {
  const descriptions = await getHomepageDescriptions();

  expect(descriptions.size).toBe(2);
  expect(descriptions.get("Page 1")).toBe("Sample description");
  expect(descriptions.get("Page 2")).toBe("Sample description");
});