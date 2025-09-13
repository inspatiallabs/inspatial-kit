import { CreatorPortalSidebarMenu } from "./menu.side.tsx";
import { Choose } from "@in/widget/control-flow/choose/index.ts";
import { useCreatorPortal } from "./state.ts";
import { View, XStack, YStack } from "@inspatial/kit/structure";
import { EditorDataView } from "./data/view.tsx";
import { CreatorPortalTopbarMenu } from "./menu.top.tsx";

/*#################################(EDITOR VIEW)#################################*/

export function EditorView() {
  /***********************************(Render)*********************************** */
  return (
    <>
      <YStack
        style={{
          web: {
            minWidth: "100%",
            maxWidth: "100%",
            gap: "2px",
          },
        }}
      >
        {/*#################################(CREATOR PORTAL TOPBAR MENU)#################################*/}

        <CreatorPortalTopbarMenu />

        <XStack
          style={{
            web: {
              width: "100%",
              height: "100vh",
              gap: "2px",
            },
          }}
        >
          {/*#################################(CREATOR PORTAL EXPLORER PANEL)#################################*/}

          <CreatorPortalSidebarMenu />

          {/*#################################(CREATOR PORTAL VIEW)#################################*/}

          <View style={{ web: { width: "100%" } }}>
            <Choose
              cases={[
                // {
                //   when: "devMode",
                //   children: <EditorDevModeView />,
                // },
                // {
                //   when: "spec",
                //   children: <EditorSpecView />,
                // },
                // {
                //   when: "window",
                //   children: <EditorWindowView />,
                // },
                // {
                //   when: "scene",
                //   children: <EditorSceneView />,
                // },
                {
                  when: () => useCreatorPortal.mode.get().data === "collection",
                  children: <EditorDataView view="collection" />,
                },
                {
                  when: () => useCreatorPortal.mode.get().data === "insights",
                  children: <EditorDataView view="insights" />,
                },
                {
                  when: () => useCreatorPortal.mode.get().data === "api",
                  children: <EditorDataView view="api" />,
                },
              ]}
              otherwise={<EditorDataView view="collection" />}
            />
          </View>
        </XStack>
      </YStack>
    </>
  );
}
