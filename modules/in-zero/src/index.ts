/**
 * InZero
 * @description InZero is a global object that is used to access the Deno API. Deno NameSpace and InSpatial's lowest level API.
 * @author InSpatial
 * @version 0.7.0
 * @since 0.7.0
 */
// Initialize global InZero once, aliasing to Deno at runtime
// Safe in browsers without Deno (remains undefined)
// @ts-ignore
(globalThis as any).InZero ??= (globalThis as any).Deno;
// @ts-ignore
export const InZero = (globalThis as any).InZero as typeof Deno;
