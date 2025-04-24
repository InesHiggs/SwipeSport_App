/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#A7DF30"; // Changed from previous purple color

export const Colors = {
  light: {
    text: "#000000",
    textSecondary: "#666666",
    background: "#ffffff",
    tint: tintColorLight,
    primary: "#A7DF30", // Changed to new lime green color
    secondary: "#D8F5A2", // Updated to a lighter shade of the primary color
    placeholder: "#999999",
    tabIconDefault: "#cccccc",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ffffff",
    textSecondary: "#cccccc",
    background: "#000000",
    tint: tintColorLight,
    primary: "#A7DF30", // Changed to new lime green color
    secondary: "#D8F5A2", // Updated to match light theme
    placeholder: "#666666",
    tabIconDefault: "#666666",
    tabIconSelected: tintColorLight,
  },
};

export default Colors;
