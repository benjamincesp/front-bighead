const defaultTheme = require("tailwindcss/defaultTheme");

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar: string) {
  return ({ opacityVariable, opacityValue }: { opacityVariable?: string, opacityValue?: string }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        xl: "40px",
        "2xl": "128px",
      },
    },
    fontFamily: {
      display: ["var(--font-display)", ...defaultTheme.fontFamily.sans],
      body: ["var(--font-body)", ...defaultTheme.fontFamily.sans],
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: {
          50: customColors("--c-primary-50"),
          // ... (rest of the primary color configuration)
        },
        secondary: {
          50: customColors("--c-secondary-50"),
          // ... (rest of the secondary color configuration)
        },
        otherblue: {
          50: customColors("--c-otherblue-50"),
          // ... (rest of the otherblue color configuration)
        },
        neutral: {
          50: customColors("--c-neutral-50"),
          // ... (rest of the neutral color configuration)
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("postcss-import"),
    require("postcss-nesting"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
