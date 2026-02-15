import * as Clipboard from "expo-clipboard";

export const copyToClipboard = (string: string) => {
  Clipboard.setStringAsync(string);
};
