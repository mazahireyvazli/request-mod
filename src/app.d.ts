// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

type ColorScheme = "light" | "dark" | "default";

var colorScheme: {
  storageKey: string;
  initialValue: "default";
  mql: () => MediaQueryList | undefined;
  getCalculated: () => ColorScheme;
  getPreferred: () => ColorScheme;
  apply: (value: ColorScheme) => void;
  initListeners: () => void;
};

declare module "*?inlinejs" {
  const content: string;
  export default content;
}

declare module "*?inlinejs&sideeffect" {
  const content: string;
  export default content;
}
