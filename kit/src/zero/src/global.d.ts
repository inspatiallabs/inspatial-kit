declare global {
  var InZero: typeof Deno;
  interface Window {
    InZero: typeof Deno;
  }
}
export {};
