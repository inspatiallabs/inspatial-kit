////////////////////////////////////////////////////////////////////////////////////////////
// DESCRIPTION: This state holds the shared states & actions for the entire creator portal
////////////////////////////////////////////////////////////////////////////////////////////

import { createState } from "@inspatial/kit/state";
import { CreatorPortalProps } from "./type.ts";

/******************************************************************************************************************************/
/*****************************************************(CREATOR PORTAL STATE)*************************************************/
/******************************************************************************************************************************/

export const useCreatorPortal = createState.in({
  /***************************(ID)***************************/

  id: "creator-portal",

  /***************************(INITIAL STATE)***************************/
  initialState: <CreatorPortalProps>(<unknown>{
    mode: {
      spec: <CreatorPortalProps["mode"]["spec"]>{},
      window: <CreatorPortalProps["mode"]["window"]>{},
      scene: <CreatorPortalProps["mode"]["scene"]>{},
      data: <CreatorPortalProps["mode"]["data"]>"collection",
      devMode: <CreatorPortalProps["mode"]["devMode"]>{},
    },
  }),

  /******************************(ACTIONS)******************************/
  action: {
    /*########################(Set Mode)########################*/
    setMode: {
      key: "mode",
      fn: (_: string, mode: CreatorPortalProps["mode"]) => mode,
    },
  },

  /******************************(STORAGE)******************************/
  storage: [
    {
      key: "mode",
      fn: (_: string, mode: CreatorPortalProps["mode"]) => mode,
      storage: "local",
    },
  ],
});
