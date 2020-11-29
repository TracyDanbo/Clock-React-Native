import {DefaultTheme, DarkTheme} from '@react-navigation/native';

export const Dark = {
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: DefaultTheme.colors.primary,
    background: '#212121',
    card: '#484848',
  },
};
export const Light = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,

    card: '#212121',
  },
};
