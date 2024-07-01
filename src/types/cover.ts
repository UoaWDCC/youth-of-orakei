export type cover =
  | {
      type: "external";
      external: { url: string };
    }
  | {
      type: "file";
      file: { url: string; epiry_time: string };
    }
  | null;
