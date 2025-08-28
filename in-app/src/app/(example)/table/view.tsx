import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableWrapper,
} from "@inspatial/kit/control-flow";
import { EntryProps, useCounter } from "../counter/state.ts";

export function TableView() {
    
  const entries = useCounter.entries;

  return (
    <>
      {/* Table Primitives */}
      <TableWrapper>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.get().map((entry: EntryProps) => (
            <TableRow key={entry.id}>
              <TableCell>{entry.id}</TableCell>
              <TableCell>{entry.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>
    </>
  );
}
