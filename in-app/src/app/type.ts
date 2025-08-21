/*
  ####################################################################################################
  ######################################(APP TYPE)######################################
  ####################################################################################################
*/

export interface AppStateProps {
  // Resizing
  isResizing?: boolean;
  setResizing?: (value: boolean) => void;

  defaultHeight?: number;
  setDefaultHeight?: (value: number) => void;

  defaultWidth?: number;
  setDefaultWidth?: (value: number) => void;

  //Modal
  isModalOpen?: boolean;
  setIsModalOpen?: (value: boolean) => void;

  modalId?: string | null;
  setModalId: (id: string | null) => void;

  openModal: (id: string) => void;
  closeModal: () => void;

  /**
   * @description This is the id of the component block that is currently active
   */
  activeComponentBlock?: string | null;
  setActiveComponentBlock?: (id: string) => void;

  // Trigger ID
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

/*
  ####################################################################################################
  ######################################(CREATOR PORTAL STATE TYPE)###################################
  ####################################################################################################
*/

// CREATOR PORTAL MENU PROPERTIES
export type EditorModeProps = "Spec" | "Window" | "Scene" | "Cloud";

export interface EditorProps {
  // user?: User | null;
  editorMode?: EditorModeProps;
  setEditorMode?: (value: EditorModeProps) => void;
}
