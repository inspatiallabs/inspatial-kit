export type DeviceTypes = "Desktop" | "Mobile" | "Tablet" | "Headset";

export type EditorComponents =
  /**=============================== HIGH LEVEL COMPONENTS =============================== */
  | "ornament"
  | "presentation"
  | "icon"
  | "input"
  | "media"
  | "navigation"
  | "visualization"
  | "theme"
  | "particle"
  | "pattern"

  /**=============================== STRUCTURAL COMPONENTS =============================== */
  | "__body" // underscore is a special character that represents the body of the page or the root of the UI
  | "frame" // frame is a freeform/absolute div powered by Movable

  // (Stacks)
  | "xStack" //horizontal flex container with flexDirection: "row"
  | "yStack" //vertical flex container with flexDirection: "column"
  | "zStack" //zStack is a 3d container with perspective and transform

  // (Grids)
  | "grid" //grid is a grid container

  /**=============================== DATA COMPONENTS =============================== */
  | "table" // interactive data table
  | "list" //list is a list container
  | "infiniteGrid" //infiniteGrid is a grid container with infinite columns
  | "infiniteList" //infiniteList is a list container with infinite rows
  | "chart" //chart is a data visualization component powered by ...

  /**=============================== NESTED COMPONENTS =============================== */
  | "uiNest"
  | "sceneNest"

  /**=============================== WIDGET COMPONENTS =============================== */
  | "header"
  | "footer"

  /**=============================== FORM COMPONENTS =============================== */
  | "contactForm"
  | "stripeForm"
  | "authForm"

  /**=============================== EMBEDDABLE COMPONENTS =============================== */
  | "map"
  | "iFrame"
  | "riveGraphics"
  | "splineScene"
  | "lottieAnimation"

  /**=============================== ADVANCED COMPONENTS =============================== */
  | "panorama" //panorama is a 360 image viewer powered by View360
  | "carousel" //carousel is a slider powered by Flicking
  | "camera"
  | null;

/****************************************(EDITOR ELEMENTS)*****************************************/

export type EditorElement = {
  id: string;
  styles: JSX.SharedProps["style"];
  name: string;
  type: EditorComponents;
  content:
    | EditorElement[]
    | { href?: string; innerText?: string; src?: string };
};

/****************************************(creator-portal)*****************************************/

export interface Editor {
  liveMode: boolean;
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  previewMode: boolean;
  devMode: boolean;
  windowId: string;
}

/****************************************(EDITOR CONTEXT TYPE)*****************************************/

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
};

export interface EditorContextType {
  windowEditorState: WindowEditorProps;
  windowEditorDispatch: unknown;
  organizationId: string;
  projectId: string;
  pageDetails: unknown | null;
}

export interface EditorProps {
  children: JSX.SharedProps["children"];
  organizationId: string;
  projectId: string;
  pageDetails: unknown;
}

/****************************************(HISTORY PROPS)*****************************************/

export interface HistoryProps {
  history: Editor[];
  currentIndex: number;
}

/****************************************(EDITOR PROPS)*****************************************/
export interface WindowEditorProps {
  editor: Editor;
  history: HistoryProps;
}

/*
  ####################################################################################################
  ######################################(WINDOW STORE TYPE)######################################
  ####################################################################################################
*/

export type WindowModalStepProps =
  | "WindowType"
  | "PageTemplate"
  | "PageName"
  | "UIName";

export type WindowControlModeProps = "Select" | "Pan";
export interface WindowStoreProps {
  windowModalStep: WindowModalStepProps;
  setWindowModalStep: (value: WindowModalStepProps) => void;

  windowControlMode: WindowControlModeProps;
  setWindowControlMode: (value: WindowControlModeProps) => void;

  // working with multiple windows (pages & ui)
  activeWindowId: string;
  setActiveWindowId: (windowId: string) => void;
}

export type WindowScreenSizeProps = "XS" | "SM" | "MD" | "LG" | "XL";
export interface WindowStoreProps {
  windowScreenSize: WindowScreenSizeProps;
  setWindowScreenSize: (value: WindowScreenSizeProps) => void;

  isFilterOpen: boolean;
  setIsFilterOpen: (value: boolean) => void;
}

export type WindowOSProps = "VisionOS" | "HorizonOS" | "iOS" | "Android";
export interface WindowStoreProps {
  windowOS: WindowOSProps;
  setWindowOS: (value: WindowOSProps) => void;
}

/*******************************************************************************************************************/
/****************************************WINDOW TYPES EXTENDING DATABASE SCHEMA*************************************/
/*******************************************************************************************************************/
//TODO: // gets the type of the window generated by @inspatial/cloud without including the Project relations type
export type WindowProps = unknown;
export type WindowsForProject = unknown;
