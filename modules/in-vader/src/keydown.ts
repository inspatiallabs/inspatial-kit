// Keyboard navigation for radio groups
export function handleKeyDown(
  event: KeyboardEvent,
  isSelection: boolean,
  name: string
) {
  if (!isSelection || !name) return;

  const key = event.key;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(key))
    return;

  // Find all radio items with the same name in the document
  const radioItems = Array.from(
    document.querySelectorAll(`[data-radio-name="${name}"]`)
  ) as HTMLElement[];

  if (radioItems.length <= 1) return;

  const currentIndex = radioItems.findIndex((item) => item === event.target);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex;

  switch (key) {
    case "ArrowUp":
    case "ArrowLeft":
      event.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : radioItems.length - 1;
      break;
    case "ArrowDown":
    case "ArrowRight":
      event.preventDefault();
      nextIndex = currentIndex < radioItems.length - 1 ? currentIndex + 1 : 0;
      break;
    case "Tab":
      // Let Tab work normally for moving between radio groups
      return;
  }

  if (nextIndex !== currentIndex) {
    const nextItem = radioItems[nextIndex];
    nextItem.focus();
    nextItem.click(); // Trigger selection
  }
}
