import cloud from "@app/(cloud)/index.ts";
import { Counter } from "./counter.tsx";

export async function App() {
  
  const user = await cloud.auth.login("test@test.com", "test");

  console.log(user);
  return (<Counter />);
}
