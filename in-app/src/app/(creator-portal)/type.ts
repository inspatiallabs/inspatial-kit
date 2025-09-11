import { WindowProps } from "./(editor)/window/type.ts";
import { SceneEditorProps } from "./(editor)/scene/type.ts";
import { DataProps } from "./data/type.ts";
import { DevModeProps } from "./dev-mode/type.ts";

/*####################################################################################################
######################################(EDITOR MODE TYPE)######################################
####################################################################################################*/

export interface CreatorPortalModeProps {
  spec?: object | unknown;
  window?: object | WindowProps;
  scene?: object | SceneEditorProps;
  data?: DataProps | DataProps["view"];
  devMode?: DevModeProps;
}

/*####################################################################################################
######################################(CREATOR PORTAL PROPS)######################################
####################################################################################################*/

export interface CreatorPortalProps {
  /************************(MODE)************************/

  mode: CreatorPortalModeProps;
}
