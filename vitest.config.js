// vitest.config.ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    clearMocks: true,
    globals: true,
    setupFiles: ['dotenv/config'] //this line,
  },
})