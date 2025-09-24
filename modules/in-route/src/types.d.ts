export interface ExtensionTriggerTypes {
  route: {
    path: string;
    params?: Record<string, string>;
    query?: Record<string, string>;
    name?: string;
  };
}
