import { getCovers } from "../src/scripts/getCovers";
import { assert, expect, test } from "vitest";

let covers = await getCovers();

test("Covers exists", () => {
  expect(covers).toBeDefined();
});


test("Covers has a cover with url", () => {
  expect(covers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: "Anton",
        cover: "https://www.notion.so/images/page-cover/webb3.jpg",
      }),
    ])
  );
});

test("Covers has a cover with undefined", () => {
  expect(covers).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "Chris", cover: undefined }),
    ])
  );
});

