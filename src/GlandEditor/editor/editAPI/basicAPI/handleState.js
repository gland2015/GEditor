import {EditorState, Modifier, ContentState, convertFromRaw} from 'draft-js';

import {basicSelectionState, getForwardSelection} from './handleSelect';
import {basicBlockData, deleteBlock, getWrapperStartKey} from './handleBlock';

// 已处理选择范围跨块且包含整体包装的情况（删除整体）
// 折叠需要更新的块只有焦点块
// 折叠基于第一个块和最后一个块始终是文本块，即delete不可乱删
function makeCollapsed(e) {
  let sel = e.getSelection();
  // 已折叠
  if (sel.isCollapsed()) return e;
  // 不折叠但同块
  let content = e.getCurrentContent();
  sel = getForwardSelection(sel);
  if (sel.anchorKey === sel.focusKey) {
    content = Modifier.removeRange(content, sel, 'backward');
    sel = basicSelectionState.merge({
      anchorKey: sel.anchorKey,
      focusKey: sel.anchorKey,
      anchorOffset: sel.anchorOffset,
      focusOffset: sel.anchorOffset
    });
    e = EditorState.push(e, content, 'delete-character');
    return EditorState.forceSelection(e, sel);
  }
  // focusKey就在下一个块且offset为0（谷歌浏览器双或三击选择文本行为），视为同块
  if (sel.focusOffset === 0 && content.getKeyAfter(sel.anchorKey) === sel.focusKey) {
    sel = sel.merge({
      focusKey: sel.anchorKey,
      focusOffset: content.getBlockForKey(sel.anchorKey).getText().length
    });
    if (sel.anchorOffset !== sel.focusOffset) {
      content = Modifier.removeRange(content, sel, 'backward');
      e = EditorState.push(e, content, 'delete-character');
    }
    sel = basicSelectionState.merge({
      anchorKey: sel.anchorKey,
      focusKey: sel.anchorKey,
      anchorOffset: sel.anchorOffset,
      focusOffset: sel.anchorOffset
    });
    return EditorState.forceSelection(e, sel);
  }
  // 不折叠且不同块，则要寻找合适的selection范围以删除
  let anchorKey, anchorOffset;
  let focusKey, focusOffset;
  // 由于sel不会在非文本块里，所以只需考虑固定块
  let block = content.getBlockForKey(sel.anchorKey);
  let wrapperStartKey = getWrapperStartKey(block);
  // 锚处有固定块则扩大到无固定块结尾
  if (!wrapperStartKey) {
    anchorKey = sel.anchorKey;
    anchorOffset = sel.anchorOffset;
  } else {
    while (wrapperStartKey) {
      block = content.getBlockBefore(block.getKey());
      wrapperStartKey = getWrapperStartKey(block);
    }
    anchorKey = block.getKey();
    anchorOffset = block.getText().length;
  }
  block = content.getBlockForKey(sel.focusKey);
  wrapperStartKey = getWrapperStartKey(block);
  //
  if (!wrapperStartKey) {
    focusKey = sel.focusKey;
    focusOffset = sel.focusOffset;
  } else {
    while (wrapperStartKey) {
      block = content.getBlockAfter(block.getKey());
      wrapperStartKey = getWrapperStartKey(block);
    }
    block = content.getBlockBefore(block.getKey());
    focusKey = block.getKey();
    focusOffset = block.getText().length;
  }
  sel = basicSelectionState.merge({
    anchorKey,
    anchorOffset,
    focusKey,
    focusOffset
  });
  content = Modifier.removeRange(content, sel, 'backward');
  e = EditorState.push(e, content, 'delete-character');
  sel = sel.merge({focusKey: anchorKey, focusOffset: anchorOffset});
  return EditorState.forceSelection(e, sel);
}

// 需折叠
function insertText(e, text) {
  let content = e.getCurrentContent();
  let sel = e.getSelection();
  let key = sel.anchorKey;
  let offset = sel.anchorOffset;
  let style = e.getCurrentInlineStyle();
  content = Modifier.insertText(content, sel, text, style);
  e = EditorState.push(e, content, 'insert-characters');
  offset += text.length;
  sel = sel.merge({
    anchorOffset: offset,
    anchorKey: key,
    focusOffset: offset,
    focusKey: key
  });
  e = EditorState.forceSelection(e, sel);
  return e;
}

// 需折叠且不为位置0
function plainBackspace(e) {
  let sel = e.getSelection();
  let offset = sel.anchorOffset - 1;
  let content = e.getCurrentContent();
  sel = sel.merge({anchorOffset: offset});
  content = Modifier.removeRange(content, sel, 'backward');
  sel = sel.merge({focusOffset: offset});
  e = EditorState.push(e, content, 'delete-character');
  e = EditorState.forceSelection(e, sel);
  return e;
}

// 无，字符串，state皆可
function getContentState(contentState, options = {}) {
  let blockData;
  if (!contentState) {
    contentState = ContentState.createFromText('');
    blockData = basicBlockData.set('metadata', options);
  } else if (typeof contentState === 'string') {
    contentState = convertFromRaw(contentState);
  }
  let firstBlock = contentState.getFirstBlock();
  let key = firstBlock.getKey();
  let sel = basicSelectionState.merge({anchorKey: key, focusKey: key});
  if (!blockData) {
    let metadata = firstBlock.getData().get('metadata') || {};
    blockData = blockData.set('metadata', Object.assign(metadata, options));
  }
  return Modifier.setBlockData(contentState, sel, blockData);
}

function getEditorState(state = '', options = {}) {
  let editorState;
  let contentState;
  if (state.constructor === EditorState) {
    editorState = state;
    contentState = editorState.getCurrentContent();
  }
  contentState = getContentState(state, options);
  if (!editorState) {
    return EditorState.createWithContent(contentState);
  }

  return EditorState.push(editorState, contentState, 'change-block-data');
}

export {makeCollapsed, insertText, plainBackspace, getContentState, getEditorState};
