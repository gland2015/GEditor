import {RichUtils, Modifier, EditorState} from 'draft-js';
import {basicSelectionState, reduceCurrentStyles} from './basicAPI/handleSelect';

function getReg(name) {
  let type,
    str = '^';
  name = name.split(';');
  name.forEach((value, i) => {
    if (value) {
      type = value.split(':')[0];
      str += type + ':[^;]*';
      if (name[i + 1]) {
        str += ';';
      } else {
        str += ';?';
      }
    }
  });
  return new RegExp(str);
}
// 移除是与name同类型的样式，也包括name，name不是字符串则移除所有
const inlineRemove = (e, name) => {
  let reg;
  let toUpdateKeys = [];
  if (typeof name !== 'string') {
    // 移除所有内联样式
    reg = /[.\n]*/;
  } else {
    reg = getReg(name);
  }
  let editorState = e;
  const currentStyle = e.getCurrentInlineStyle();
  const sel = e.getSelection();
  let contentState = e.getCurrentContent();

  const Fn = (contentState, start, end, block, key) => {
    if (toUpdateKeys[0] !== key) {
      toUpdateKeys.unshift(key);
    }
    const currentStyle = block.getInlineStyleAt(start);
    currentStyle.forEach(value => {
      if (value.match(reg)) {
        const sel = basicSelectionState.merge({
          anchorKey: key,
          anchorOffset: start,
          focusKey: key,
          focusOffset: end
        });
        contentState = Modifier.removeInlineStyle(contentState, sel, value);
      }
    });
    return contentState;
  };
  if (sel.isCollapsed()) {
    currentStyle.forEach(value => {
      if (value.match(reg)) {
        editorState = RichUtils.toggleInlineStyle(e, value);
      }
    });
    toUpdateKeys = [sel.anchorKey];
  } else {
    contentState = reduceCurrentStyles(Fn, contentState, sel);
    editorState = EditorState.push(e, contentState, 'change-inline-style');
    editorState = EditorState.forceSelection(editorState, sel);
  }
  return {editorState, toUpdateKeys};
};

const applyInlineStyle = (e, name) => {
  let {editorState, toUpdateKeys} = inlineRemove(e, name);
  editorState = RichUtils.toggleInlineStyle(editorState, name);
  return {editorState, toUpdateKeys};
};

const removeInlineStyle = (e, name) => {
  const {editorState, toUpdateKeys} = inlineRemove(e, name);
  return {editorState, toUpdateKeys};
};

export {applyInlineStyle, removeInlineStyle};
