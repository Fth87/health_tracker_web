import type { Config } from 'tailwindcss';
import { nextui } from '@nextui-org/theme';

export default {
  content: [
    './{app,pages,components,src/{app,pages,components}}/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
} satisfies Config;
