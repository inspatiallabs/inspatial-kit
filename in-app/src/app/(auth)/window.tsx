// Using trigger props with programmatic router; Link is temporarily disabled

export function AuthWindow() {
  return (
    <>
      <h1>Auth Page (Entry Window)</h1>
      <nav class="flex gap-3 mt-3">
        <a href="/">Home</a>
        <a href="/counter">Counter</a>
        <a href="/projects">Projects</a>
      </nav>
    </>
  );
}
