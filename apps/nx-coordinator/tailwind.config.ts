import { type Config } from "tailwindcss";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...theme.fontFamily.sans],
      },
    },
  },
} satisfies Config;
