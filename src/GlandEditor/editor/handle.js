
import {editEvent, preEditEvent} from '../utils/global/namespace';
import {makeCollapsed, insertText} from './editAPI/basicAPI/handleState';

const getEditEvent = detail => {
  return new CustomEvent(editEvent, {detail});
};

const getPreEditEvent = detail => {
  return new CustomEvent(preEditEvent, {detail});
};

function handleCompositionStart(e) {
  e.preventDefault();
  e.stopPropagation();
  let editorState = this.state.editorState;
  let sel = editorState.getSelection();
  let key = sel.anchorKey;
  if (!sel.isCollapsed()) {
    editorState = makeCollapsed(editorState);
    sel = editorState.getSelection();
    key = sel.anchorKey;
    this.updateEditorState(editorState, [key]);
  }
  this.startState = editorState;

  // 渲染优化
  if (sel.anchorOffset) {
    if (!editorState.getInlineStyleOverride()) {
      this.startUpdateKeys = [];
      return;
    }
  }
  this.startUpdateKeys = [key];
  return;
}

function handleCompositionEnd(e) {
  // e.preventDefault();
  e.stopPropagation();
  const text = e.data;
  let editorState = insertText(this.startState, text);
  this.startState = null;
  this.updateEditorState(editorState, this.startUpdateKeys);
}

function handleBeforeInput(e) {
  e.preventDefault && (e.preventDefault = e => 1);
  return 'handled';
}

function handleMouseDown(e) {
  let tar = e.target;
  let type;
  let isTextType = false;

  if (tar.dataset.text === 'true') {
    return;
  }

  for (let i = 0; i < 3; i++) {
    tar = tar.parentElement;
    type = tar.dataset.type;
    if (type) {
      if (type === 'text') {
        isTextType = true;
      }
      break;
    }
  }
  if (!isTextType) {
    e.preventDefault();
    return;
  }
}

export {
  getEditEvent,
  getPreEditEvent,
  handleCompositionStart,
  handleCompositionEnd,
  handleBeforeInput,
  handleMouseDown
};
