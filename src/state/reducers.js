import { PluginActionTypes } from './actions';

/** Reducer for text display options for each window */
export const windowTextDisplayOptionsReducer = (state = {}, action) => {
  if (action.type === PluginActionTypes.SET_WINDOW_TEXTDISPLAY_OPTIONS) {
    return {
      ...state,
      [action.windowId]: {
        ...state[action.windowId],
        ...action.textDisplayOptions,
      },
    };
  }
  return state;
};

/** Reducer for global text overlay state */
export const textsReducer = (state = {}, action) => {
  switch (action.type) {
    case PluginActionTypes.REQUEST_TEXT:
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          isFetching: true,
          source: action.textUri,
        },
      };
    case PluginActionTypes.RECEIVE_TEXT:
      {
        const currentText = state[action.targetId];
        // Dont overwrite the current text if we already have an OCR-sourced
        // text that was completely fetched without an error
        const skipText = currentText !== undefined
          && !currentText.error
          && !currentText.isFetching
          && currentText.sourceType === 'ocr';
        if (skipText) return state;
      }
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          isFetching: false,
          source: action.textUri,
          sourceType: action.sourceType,
          text: action.parsedText,
        },
      };
    case PluginActionTypes.RECEIVE_TEXT_FAILURE:
      return {
        ...state,
        [action.targetId]: {
          ...state[action.targetId],
          error: action.error,
          isFetching: false,
          source: action.textUri,
          sourceType: action.sourceType,
        },
      };
    default: return state;
  }
};