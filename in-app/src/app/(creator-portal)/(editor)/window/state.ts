/*********************************************************************************************************
 * 
//Description: This file is responsible for managing the state of the creator portal
// Window editor.

*********************************************************************************************************/
/* 
  #########################################################################################################
  ################################(WINDOW EDITOR STATE)###############################
  #########################################################################################################
*/

import { createState } from "@inspatial/kit/state";
import {
  EditorElement,
  DeviceTypes,
  HistoryProps,
  WindowEditorProps,
  WindowTypes,
} from "./type.ts";

/*####################################(ACTION MAP)####################################*/
// This is the action that is used to change the state
//###############################################################################

/***************************ENUMS***************************/
export enum windowEditorAction {
  addElement = "ADD_ELEMENT",
  updateElement = "UPDATE_ELEMENT",
  deleteElement = "DELETE_ELEMENT",
  changeClickedElement = "CHANGE_CLICKED_ELEMENT",
  changeDevice = "CHANGE_DEVICE",
  changeWindow = "CHANGE_WINDOW",
  togglePreviewMode = "TOGGLE_PREVIEW_MODE",
  toggleLiveMode = "TOGGLE_LIVE_MODE",
  redo = "REDO",
  undo = "UNDO",
  loadData = "LOAD_DATA",
  setWindowId = "SET_WINDOW_ID",
}

/***************************TYPES***************************/

export type EditorAction =
  | {
      type: windowEditorAction.addElement;
      payload: {
        containerId: string;
        elementDetails: EditorElement;
      };
    }
  | {
      type: windowEditorAction.updateElement;
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: windowEditorAction.deleteElement;
      payload: {
        elementDetails: EditorElement;
      };
    }
  | {
      type: windowEditorAction.changeClickedElement;
      payload: {
        elementDetails?:
          | EditorElement
          | {
              id: "";
              content: [];
              name: "";
              styles: {};
              type: null;
            };
      };
    }
  | {
      type: windowEditorAction.changeDevice;
      payload: {
        device: DeviceTypes;
      };
    }
  | {
      type: windowEditorAction.changeWindow;
      payload: {
        window: WindowTypes;
      };
    }
  | {
      type: windowEditorAction.togglePreviewMode;
      payload?: {
        value: boolean;
      };
    }
  | {
      type: windowEditorAction.toggleLiveMode;
      payload?: {
        value: boolean;
      };
    }
  | { type: windowEditorAction.redo }
  | { type: windowEditorAction.undo }
  | {
      type: windowEditorAction.loadData;
      payload: {
        elements: EditorElement[];
        withLive: boolean;
      };
    }
  | {
      type: windowEditorAction.setWindowId;
      payload: {
        windowId: string;
      };
    };

/*####################################(INITIAL STATE)####################################*/
// sets the initial state or default values for the window editor props
//########################################################################################
const initialEditorState: WindowEditorProps["editor"] = {
  elements: [
    {
      content: [],
      id: "__body",
      name: "Body",
      styles: {},
      type: "__body",
    },
  ],
  selectedElement: {
    id: "",
    content: [],
    name: "",
    styles: {},
    type: null,
  },
  device: "Desktop",
  type: "flat",
  previewMode: false,
  liveMode: false,
  devMode: false,
  windowId: "",
};

/*####################################(INITIAL HISTORY STATE)####################################*/
// sets the initial state or default values for the window editor history
//########################################################################################
const initialHistoryState: HistoryProps = {
  history: [initialEditorState],
  currentIndex: 0,
};

/*####################################(INITIAL STATE)####################################*/
// sets the initial state or default values for the window editor
//########################################################################################

const initialState: WindowEditorProps = {
  editor: initialEditorState,
  history: initialHistoryState,
};

/*####################################(REDUCERS)####################################*/
// This is the reducer that will be used to update the state
//##################################################################################

/***************************ADD ELEMENT FUNCTION***************************/
const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== windowEditorAction.addElement)
    throw Error(
      "You sent the wrong action type to the Add Element editor State"
    );
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      };
    }
    return item;
  });
};

/***************************UPDATE ELEMENT FUNCTION***************************/

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== windowEditorAction.updateElement) {
    throw Error("You sent the wrong action type to the update Element State");
  }
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      };
    }
    return item;
  });
};

/***************************DELETE ELEMENT FUNCTION***************************/

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== windowEditorAction.deleteElement)
    throw Error(
      "You sent the wrong action type to the Delete Element editor State"
    );
  return editorArray.filter((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteAnElement(item.content, action);
    }
    return true;
  });
};

/*####################################(STATE)####################################*/
// This is the core state that is used to access the state and actions
//###############################################################################

export function useWindowEditor() {
  const state = createState.in({
    id: "window-editor",
    initialState,

    action: {
      // Add element → target 'editor', also update history via closure
      addElement: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { containerId: string; elementDetails: EditorElement }
        ) => {
          const nextEditor = {
            ...editor,
            elements: addAnElement(editor.elements, {
              type: windowEditorAction.addElement,
              payload,
            }),
          };

          // Also update history in the same trigger
          const h = state.history.peek();
          const nextHistory = [
            ...h.history.slice(0, h.currentIndex + 1),
            { ...nextEditor },
          ];
          state.history.set({
            history: nextHistory,
            currentIndex: nextHistory.length - 1,
          });

          return nextEditor;
        },
      },

      // Redo → target 'history', also set 'editor'
      redo: {
        key: "history",
        fn: (history: HistoryProps) => {
          if (history.currentIndex < history.history.length - 1) {
            const nextIndex = history.currentIndex + 1;
            const nextEditor = { ...history.history[nextIndex] };
            state.editor.set(nextEditor);
            return { ...history, currentIndex: nextIndex };
          }
          return history;
        },
      },

      // Toggle live mode
      toggleLiveMode: {
        key: "editor",
        fn: (editor: WindowEditorProps["editor"], value?: boolean) => ({
          ...editor,
          liveMode: typeof value === "boolean" ? value : !editor.liveMode,
        }),
      },

      updateElement: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { elementDetails: EditorElement }
        ) => {
          const updatedElements = updateAnElement(editor.elements, {
            type: windowEditorAction.updateElement,
            payload,
          } as EditorAction);

          const isSelected =
            editor.selectedElement.id === payload.elementDetails.id;
          const nextEditor = {
            ...editor,
            elements: updatedElements,
            selectedElement: isSelected
              ? payload.elementDetails
              : { id: "", content: [], name: "", styles: {}, type: null },
          };

          const h = state.history.peek();
          const nextHistory = [
            ...h.history.slice(0, h.currentIndex + 1),
            { ...nextEditor },
          ];
          state.history.set({
            history: nextHistory,
            currentIndex: nextHistory.length - 1,
          });
          return nextEditor;
        },
      },

      deleteElement: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { elementDetails: EditorElement }
        ) => {
          const updatedElements = deleteAnElement(editor.elements, {
            type: windowEditorAction.deleteElement,
            payload,
          } as EditorAction);

          const nextEditor = { ...editor, elements: updatedElements };
          const h = state.history.peek();
          const nextHistory = [
            ...h.history.slice(0, h.currentIndex + 1),
            { ...nextEditor },
          ];
          state.history.set({
            history: nextHistory,
            currentIndex: nextHistory.length - 1,
          });
          return nextEditor;
        },
      },

      changeClickedElement: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: {
            elementDetails?:
              | EditorElement
              | { id: ""; content: []; name: ""; styles: {}; type: null };
          }
        ) => {
          const nextEditor = {
            ...editor,
            selectedElement: payload?.elementDetails || {
              id: "",
              content: [],
              name: "",
              styles: {},
              type: null,
            },
          };
          const h = state.history.peek();
          const nextHistory = [
            ...h.history.slice(0, h.currentIndex + 1),
            { ...editor },
          ];
          state.history.set({
            history: nextHistory,
            currentIndex: nextHistory.length - 1,
          });
          return nextEditor;
        },
      },

      changeDevice: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { device: DeviceTypes }
        ) => ({
          ...editor,
          device: payload.device,
        }),
      },

      changeWindow: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { window: WindowTypes }
        ) => ({
          ...editor,
          type: payload.window,
        }),
      },

      togglePreviewMode: {
        key: "editor",
        fn: (editor: WindowEditorProps["editor"]) => ({
          ...editor,
          previewMode: !editor.previewMode,
        }),
      },

      undo: {
        key: "history",
        fn: (history: HistoryProps) => {
          if (history.currentIndex > 0) {
            const prevIndex = history.currentIndex - 1;
            const prevEditor = {
              ...history.history[prevIndex],
            } as WindowEditorProps["editor"];
            state.editor.set(prevEditor);
            return { ...history, currentIndex: prevIndex };
          }
          return history;
        },
      },

      loadData: {
        key: "editor",
        fn: (
          _editor: WindowEditorProps["editor"],
          payload: { elements: EditorElement[]; withLive: boolean }
        ) => {
          const nextEditor = {
            ...initialEditorState,
            elements: payload.elements || initialEditorState.elements,
            liveMode: !!payload.withLive,
          };
          state.history.set({ history: [nextEditor], currentIndex: 0 });
          return nextEditor;
        },
      },

      setWindowId: {
        key: "editor",
        fn: (
          editor: WindowEditorProps["editor"],
          payload: { windowId: string }
        ) => {
          const nextEditor = { ...editor, windowId: payload.windowId };
          const h = state.history.peek();
          const nextHistory = [
            ...h.history.slice(0, h.currentIndex + 1),
            { ...nextEditor },
          ];
          state.history.set({
            history: nextHistory,
            currentIndex: nextHistory.length - 1,
          });
          return nextEditor;
        },
      },
    },

    storage: { key: "window-editor", backend: "local" },
  });

  return {
    state, // signals: state.editor, state.history
    action: state.action, // triggers: action.addElement(...), action.redo(), etc.
  };
}
