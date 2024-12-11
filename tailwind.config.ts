import type { Config } from 'tailwindcss'
import daisyui from 'daisyui'
import daisyuiThemes from 'daisyui/src/theming/themes'

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
          ...(daisyuiThemes['light'] as Record<string, unknown>),
          primary: '#fbbf24',
        },
        dark: {
          ...(daisyuiThemes['dark'] as Record<string, unknown>),
          primary: '#fbbf24',
          '.toaster-con': {
            'background-color': 'black',
            color: 'white',
          },
        },
      },
    ],
  },
  darkMode: ['class', '["dark"]'],
}

export default config