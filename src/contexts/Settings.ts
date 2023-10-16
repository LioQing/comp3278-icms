import { createContext } from 'react';

export interface Settings {
  darkMode: boolean;
}

export const SettingsContext = createContext({
  settings: {
    darkMode: false,
  },
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  setSettings: (_: Settings) => {},
});
