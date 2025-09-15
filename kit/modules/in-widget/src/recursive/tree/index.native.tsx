import { hotkeysCoreFeature, syncDataLoaderFeature } from "./src/index.ts";
import { TreeWrapper, TreeItem, TreeItemLabel } from "./primitive.tsx";
import { createTree } from "./create-tree.ts";
import { Slot, YStack } from "@in/widget/structure/index.ts";
import { List } from "@in/widget/data-flow/index.ts";

interface Item {
  name: string;
  children?: string[];
}

const items: Record<string, Item> = {
  company: {
    name: "Company",
    children: ["engineering", "marketing", "operations"],
  },
  engineering: {
    name: "Engineering",
    children: ["frontend", "backend", "platform-team"],
  },
  frontend: { name: "Frontend", children: ["design-system", "web-platform"] },
  "design-system": {
    name: "Design System",
    children: ["components", "tokens", "guidelines"],
  },
  components: { name: "Components" },
  tokens: { name: "Tokens" },
  guidelines: { name: "Guidelines" },
  "web-platform": { name: "Web Platform" },
  backend: { name: "Backend", children: ["apis", "infrastructure"] },
  apis: { name: "APIs" },
  infrastructure: { name: "Infrastructure" },
  "platform-team": { name: "Platform Team" },
  marketing: { name: "Marketing", children: ["content", "seo"] },
  content: { name: "Content" },
  seo: { name: "SEO" },
  operations: { name: "Operations", children: ["hr", "finance"] },
  hr: { name: "HR" },
  finance: { name: "Finance" },
};

const indent = 10;

export function Tree() {
  const tree = createTree<Item>({
    initialState: {
      expandedItems: ["engineering", "frontend", "design-system"],
    },
    indent,
    rootItemId: "company",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  });

  console.log("Tree: tree created successfully", tree);

  return (
    <YStack className="h-full *:first:grow" gap={2}>
      <TreeWrapper indent={indent} tree={tree}>
        <List each={tree.items}>
          {(item: any) => {
            try {
              return (
                <TreeItem key={item.getId()} item={item} indent={indent}>
                  <TreeItemLabel item={item} />
                </TreeItem>
              );
            } catch (itemError) {
              console.error(
                "Tree: Error rendering item",
                item?.getId?.(),
                itemError
              );
              return <Slot>Error rendering item: {String(itemError)}</Slot>;
            }
          }}
        </List>
      </TreeWrapper>
    </YStack>
  );
}
