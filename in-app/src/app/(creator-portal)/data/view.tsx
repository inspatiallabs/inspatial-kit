import {
  EditorDataCollectionView,
  EditorDataApiExplorerView,
  EditorDataInsightsView,
} from "./index.ts";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import { DataProps, DataViewProps } from "./type.ts";

/*#################################(Render)#################################*/

export function EditorDataView({ view }: { view: DataProps["view"] }) {
  return (
    <>
      <Choose
        cases={[
          {
            when: view === "collection",
            children: <EditorDataCollectionView />,
          },
          {
            when: view === "insights",
            children: <EditorDataInsightsView />,
          },
          {
            when: view === "api",
            children: <EditorDataApiExplorerView />,
          },
        ]}
        otherwise={<EditorDataCollectionView />}
      />
    </>
  );
}
