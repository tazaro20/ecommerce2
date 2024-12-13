import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0ea5e9",
          "secondary": "#7dd3fc",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#f0f9ff",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
        dark: {
          "primary": "#0ea5e9",
          "secondary": "#7dd3fc",
          "accent": "#37CDBE",
          "neutral": "#3D4451",
          "base-100": "#1e293b",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  darkMode: ['class', '[data-theme="dark"]'],
}

export default config