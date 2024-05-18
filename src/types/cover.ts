export type cover =
  | {
      type: "external";
      external: { url: string };
    }
  | null;
