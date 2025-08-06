// deno-lint-ignore-file
import { createSignal, $ } from "@inspatial/run/signal";
import { Show, List } from "@inspatial/run/kit";

export function Counter() {
  /*******************************(Functions)*************************************/
  const count = createSignal(0);
  const message = $(() => `Count is: ${count.value}`);

  interface Entry {
    id: number;
    name: string;
  }

  const entries = createSignal<Entry[]>([
    { id: 1, name: "Hot reload test working! App🔥" },
    { id: 2, name: "DOM renderer is running 🦵" },
    { id: 3, name: "Interactivity is a check ✅" },
  ]);

  /*******************************(Render)*************************************/

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center gap-10 bg-black">
        <h1 className="text-yellow-500 text-8xl">🚀 InSpatial App!</h1>
        <List each={entries} track="id">
          {(entry: Entry) => (
            <p className="flex flex-col text-2xl text-white">{entry.name}</p>
          )}
        </List>
        <Show
          when={count.gte(10)}
          otherwise={() => <p className="text-white">Count is less than 10</p>}
        >
          <p className="text-white text-8xl">Count is 10 or greater! 🎉</p>
        </Show>
        <button
          type="button"
          id="increment"
          className="bg-red-500 p-6 rounded-full text-white font-bold text-2xl shadow-lg hover:bg-purple-600 transition-colors"
          on:click={() => count.value++}
        >
          {message}  
        </button>
      </div>
    </>
  );
}
