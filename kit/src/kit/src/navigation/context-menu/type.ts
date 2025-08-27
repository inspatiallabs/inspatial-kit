export interface ContextMenuActionProps<TData> {
  label: string;
  icon?: string;
  action: (row: TData) => void;
}
