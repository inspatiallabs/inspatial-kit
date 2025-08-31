/**
 * InZero
 * @description InZero is a global object that is used to access the Deno API. Deno NameSpace and InSpatial's lowest level API.
 * @author InSpatial
 * @version 1.0.0
 * @since 1.0.0
 */
// @ts-ignore
export const InZero = (globalThis as any).Deno as typeof Deno;
